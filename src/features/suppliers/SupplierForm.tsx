import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Supplier, Product, Warehouse } from "./types/types";
import "./styles/NeonButton.css";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import emailjs from "emailjs-com";

const SupplierForm = ({
  onChange,
}: {
  onChange?: (supplier: Supplier) => void;
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>(
    {},
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<string>("");
  const [createdAt] = useState<Date>(new Date());
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [paymentPercentage, setPaymentPercentage] = useState<string>("");

  const [newPaymentType, setNewPaymentType] = useState<string>("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  // Payment states
  const [paymentTypes, setPaymentTypes] = useState<
    { type: string; percentage: string; amount: string }[]
  >([
    { type: "", percentage: "100", amount: "" }, // Initial type with 100% as default
  ]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [productsWithQuantities, setProductsWithQuantities] = useState<
    {
      product: Product;
      quantity: number;
      sku: string;
      id: string;
      priceExclTax: number;
      total: number;
    }[]
  >([]);
  const totalPercentage = paymentTypes.reduce(
    (acc, payment) => acc + (parseFloat(payment.percentage) || 0),
    0,
  );

  useEffect(() => {
    const remaining = totalAmount * ((100 - totalPercentage) / 100);
    setRemainingAmount(remaining);
  }, [paymentTypes, totalPercentage]);

  const handleSubmitComments = async () => {
    if (!comment.trim()) {
      setMessage("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      const response = await fetch("/api/saveComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const text = await response.text();
      console.log("Réponse brute du serveur:", text);

      const data = JSON.parse(text);
      setMessage(data.message);
      setComment("");
    } catch (error) {
      console.error("Erreur lors de l’enregistrement :", error);
      setMessage("Erreur lors de l'enregistrement.");
    }
  };
  useEffect(() => {
    if (remainingAmount === 0 && paymentTypes.length > 1) {
      setPaymentTypes((prevState) => prevState.slice(0, prevState.length - 1));
    }
  }, [remainingAmount]);
  useEffect(() => {
    if (
      newPaymentType &&
      paymentPercentage &&
      parseFloat(paymentPercentage) < 100
    ) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage);
      setPaymentPercentage(remainingPercentage.toString());
    }
  }, [newPaymentType]);
  const totalAmount = productsWithQuantities.reduce(
    (acc, item) => acc + item.total,
    0,
  );
  const [remainingAmounts, setRemainingAmounts] = useState([totalAmount]);

  useEffect(() => {
    if (paymentTypes.length) {
      const totalPercentage = paymentTypes.reduce(
        (acc, payment) => acc + (parseFloat(payment.percentage) || 0),
        0,
      );
      const remaining = totalAmount * ((100 - totalPercentage) / 100);
      setRemainingAmount(remaining);

      if (
        totalPercentage < 100 &&
        paymentTypes[paymentTypes.length - 1].percentage !== ""
      ) {
        setPaymentTypes([
          ...paymentTypes,
          { type: "", percentage: "", amount: "" },
        ]);
      }
    }
  }, [paymentTypes, totalAmount]);

  const handlePaymentTypeChange = (index: number, type: string) => {
    const updatedPaymentTypes = [...paymentTypes];
    updatedPaymentTypes[index].type = type;

    setPaymentTypes(updatedPaymentTypes);
  };
  const handlePaymentPercentageChange = (index: number, value: string) => {
    let newPercentage = parseFloat(value) || 0;
    if (newPercentage > 100) newPercentage = 100;
    let updatedPayments = [...paymentTypes];
    updatedPayments[index] = {
      ...updatedPayments[index],
      percentage: newPercentage.toString(),
    };
    let totalPercentage = updatedPayments.reduce(
      (acc, payment, idx) =>
        idx <= index ? acc + (parseFloat(payment.percentage) || 0) : acc,
      0,
    );

    let remainingPercentage = 100 - totalPercentage;
    if (remainingPercentage > 0) {
      updatedPayments = updatedPayments.map((payment, idx) => {
        if (idx > index) {
          return { ...payment, percentage: remainingPercentage.toString() };
        }
        return payment;
      });
    } else {
      newPercentage =
        100 -
        updatedPayments
          .slice(0, index)
          .reduce(
            (acc, payment) => acc + (parseFloat(payment.percentage) || 0),
            0,
          );
      updatedPayments[index] = {
        ...updatedPayments[index],
        percentage: newPercentage.toString(),
      };
    }
    if (index === updatedPayments.length - 1 && remainingPercentage > 0) {
      updatedPayments.push({
        type: "",
        percentage: remainingPercentage.toString(),
        amount: "",
      });
    }
    setPaymentTypes(updatedPayments);
  };

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFile(file.name);
        setFileList(data.files);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleSelectState = (state: string): void => setSelectedState(state);

  useEffect(() => {
    if (newPaymentType) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage || "0");
      setPaymentPercentage(remainingPercentage.toString());
    }
  }, [newPaymentType]);
  useEffect(() => {
    if (paymentPercentage && parseFloat(paymentPercentage) < 100) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage);
      setRemainingAmount((totalAmount * remainingPercentage) / 100); // Recalculer montant restant
    }
  }, [paymentPercentage]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then(
        (data: {
          suppliers: Supplier[];
          products: Product[];
          warehouses: Warehouse[];
        }) => {
          setSuppliers(data.suppliers);
          setProducts(data.products);
          setWarehouses(data.warehouses);
        },
      )
      .catch((error: Error) => console.error("Error loading data:", error));
  }, []);

  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.company_name);
    setSelectedSupplier(supplier);
    onChange?.(supplier);
    resetFormFields();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Order Details", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Supplier: ${selectedSupplier?.company_name}`, 20, 30);
    doc.text(`Warehouse: ${selectedWarehouse?.name}`, 20, 40);
    doc.text(`State: ${selectedState}`, 20, 50);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    let currentY = 65;
    const tableMargin = 20;
    const tableWidth = 170;

    doc.setFontSize(10);
    doc.setFillColor(230, 230, 230);
    doc.rect(tableMargin, currentY, tableWidth, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.text("No.", tableMargin + 5, currentY + 7);
    doc.text("Product", tableMargin + 25, currentY + 7);
    doc.text("Quantity", tableMargin + 85, currentY + 7);
    doc.text("Price", tableMargin + 125, currentY + 7);
    doc.text("Total", tableMargin + 155, currentY + 7);

    currentY += 12;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(tableMargin, currentY, tableMargin + tableWidth, currentY);

    currentY += 5;

    doc.setFont("helvetica", "normal");
    productsWithQuantities.forEach((item, index) => {
      if (
        item.product?.productName &&
        item.quantity &&
        item.priceExclTax &&
        item.total
      ) {
        doc.text(`${index + 1}`, tableMargin + 5, currentY + 7);
        doc.text(item.product.productName, tableMargin + 25, currentY + 7);
        doc.text(item.quantity.toString(), tableMargin + 85, currentY + 7);
        doc.text(item.priceExclTax.toFixed(2), tableMargin + 125, currentY + 7);
        doc.text(item.total.toFixed(2), tableMargin + 155, currentY + 7);

        currentY += 10;
      }
    });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(tableMargin, currentY, tableMargin + tableWidth, currentY);

    let totalAmountText = `Total Amount: ${totalAmount.toFixed(2)}`;
    currentY += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(totalAmountText, tableMargin, currentY);
    doc.save("order-details.pdf");
  };

  const handleSelectWarehouse = (warehouseName: string): void => {
    const warehouse = warehouses.find((w) => w.name === warehouseName);
    if (warehouse) {
      setSelectedWarehouse(warehouse);
      setProductsWithQuantities((prevState) => [
        ...prevState,
        {
          product: {
            id: "",
            productName: "",
            productPrice: 0,
            manufacturer_id: "",
            sku: "",
            warehouses: [],
          },
          quantity: 0,
          sku: "",
          id: `new-product-${Date.now()}`,
          priceExclTax: 0,
          total: 0,
        },
      ]);
    }
  };

  const resetFormFields = (): void => {
    setQuantities({});
    setSelectedProducts([]);
    setTotalPayment(0);
    setSelectedPaymentMode("");
    setSelectedWarehouse(null);
    setSelectedState("");
    setProductsWithQuantities([]);
  };

  const handleSelectProductInLine = (
    selectedProductId: string,
    index: number,
  ) => {
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    );
    if (selectedProduct) {
      setProductsWithQuantities((prevState) => {
        const updatedProducts = [...prevState];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product: selectedProduct,
          sku: selectedProduct.sku,
          priceExclTax: selectedProduct.productPrice,
          total: selectedProduct.productPrice * updatedProducts[index].quantity,
          id: selectedProduct.id,
        };

        return updatedProducts;
      });
    }
  };

  const addNewEmptyRow = () => {
    setProductsWithQuantities((prevState) => {
      if (
        prevState.length === 0 ||
        prevState[prevState.length - 1].product.id !== ""
      ) {
        return [
          ...prevState,
          {
            product: {
              id: "",
              productName: "",
              productPrice: 0,
              manufacturer_id: "",
              sku: "",
              warehouses: [],
            },
            quantity: 0,
            sku: "",
            id: `new-product-${Date.now()}`,
            priceExclTax: 0,
            total: 0,
          },
        ];
      }
      return prevState;
    });
  };
  const handleSendEmail = () => {
    if (
      !selectedSupplier ||
      !selectedWarehouse ||
      productsWithQuantities.length === 0
    ) {
      alert(
        "Veuillez remplir tous les champs obligatoires avant d'envoyer l'email.",
      );
      return;
    }

    const templateParams = {
      supplierName: selectedSupplier?.company_name || "Unknown Supplier",
      warehouse: selectedWarehouse?.name || "Unknown Warehouse",
      totalAmount: totalAmount?.toFixed(2) || "0.00",
      remainingAmount: remainingAmount?.toFixed(2) || "0.00",
      comment: comment || "No comment provided",

      products: productsWithQuantities.map((item) => ({
        productName: item.product.productName || "Unknown Product",
        quantity: item.quantity || 0,
        priceExclTax: item.priceExclTax?.toFixed(2) || "0.00",
        total: item.total?.toFixed(2) || "0.00",
      })),
    };

    emailjs
      .send(
        "service_z1bkm7y",
        "template_b63ikd2",
        templateParams,
        "1I-USeEEq-xcp9edT",
      )
      .then((response) => {
        console.log("Email envoyé avec succès", response);
        alert("Email envoyé avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'email", error);
        alert("Échec de l'envoi de l'email. Veuillez réessayer.");
      });
    console.log(templateParams);
  };

  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmount = Math.min(
      Math.max(parseFloat(value) || 0, 0),
      totalAmount,
    );
    const updatedPaymentTypes = [...paymentTypes];

    updatedPaymentTypes[index] = {
      ...updatedPaymentTypes[index],
      amount: String(newAmount),
      percentage:
        totalAmount > 0 ? ((newAmount / totalAmount) * 100).toFixed(2) : "0.00",
    };

    const totalAllocated = updatedPaymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),
      0,
    );

    if (index === paymentTypes.length - 1 && totalAllocated < totalAmount) {
      const remaining = totalAmount - totalAllocated;
      updatedPaymentTypes.push({
        type: "",
        percentage: ((remaining / totalAmount) * 100).toFixed(2),
        amount: String(remaining),
      });
    }

    setPaymentTypes(updatedPaymentTypes);
    setRemainingAmount(totalAmount - totalAllocated);
  };

  const calculateRemainingAmount = (
    totalAmount: number,
    amount: number | null,
    percentage: number | null,
  ) => {
    if (percentage !== null && percentage > 0) {
      return totalAmount * (percentage / 100);
    } else if (amount !== null && amount > 0) {
      return totalAmount - amount;
    }
    return 0;
  };
  useEffect(() => {
    const updatedRemainingAmounts = paymentTypes.map((payment) => {
      const amount = parseFloat(payment.amount || "0");
      const percentage = parseFloat(payment.percentage || "0");
      return calculateRemainingAmount(totalAmount, amount, percentage);
    });

    setRemainingAmounts(updatedRemainingAmounts);
  }, [paymentTypes, totalAmount]);

  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">Select Supplier</p>
            </div>
            <div className="box flex w-full justify-between rounded-lg ">
              <p>Made by{session?.user?.name}</p>
            </div>

            {/* Supplier Search Section */}
            <div className="box mb-5 mt-5 flex w-full justify-between rounded-lg bg-primary/5 p-4 dark:bg-bg3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search and select supplier..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedSupplier(null);
                  }}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
                {query && !selectedSupplier && suppliers.length > 0 && (
                  <ul className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {suppliers
                      .filter((supplier) =>
                        supplier.company_name
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((supplier) => (
                        <li
                          key={supplier.manufacturer_id}
                          onClick={() => handleSelectSupplier(supplier)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                          {supplier.company_name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Supplier Details Section */}
            {selectedSupplier && (
              <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold">Supplier Details</h3>
                <form>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Created At
                      </label>
                      <input
                        type="text"
                        value={createdAt.toLocaleDateString()}
                        disabled
                        className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        From
                      </label>
                      <input
                        type="text"
                        value={selectedSupplier.company_name}
                        disabled
                        className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                      />
                    </div>

                    {/* Select Warehouse */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Warehouse
                      </label>
                      <select
                        value={selectedWarehouse?.name || ""}
                        onChange={(e) => handleSelectWarehouse(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((warehouse) => (
                          <option key={warehouse.name} value={warehouse.name}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select State */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleSelectState(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="">Select State</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {selectedWarehouse && selectedSupplier && (
              <div className="mt-8 max-h-[500px] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                <h4 className="mb-6 text-lg font-semibold text-gray-800">
                  Select Product
                </h4>
                <div className="space-y-6">
                  {productsWithQuantities.map((item, index) => (
                    <div
                      key={item.id}
                      className="mb-6 flex items-center justify-between gap-6"
                    >
                      {/* Product Selection */}
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          Product
                        </label>
                        <select
                          value={item.product.id}
                          onChange={(e) =>
                            handleSelectProductInLine(e.target.value, index)
                          }
                          className="w-full rounded-md border border-gray-300 p-3"
                        >
                          <option value="">Select a product</option>
                          {products
                            .filter(
                              (product) =>
                                product.manufacturer_id ===
                                  selectedSupplier?.manufacturer_id &&
                                !productsWithQuantities.some(
                                  (selectedItem) =>
                                    selectedItem.product.id === product.id &&
                                    selectedItem.id !== item.id,
                                ),
                            )
                            .map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.productName}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            setProductsWithQuantities((prevState) => {
                              const updatedProducts = [...prevState];
                              updatedProducts[index] = {
                                ...updatedProducts[index],
                                quantity: newQuantity,
                                total:
                                  newQuantity *
                                  updatedProducts[index].priceExclTax, // Mise à jour du total
                              };
                              return updatedProducts;
                            });
                          }}
                          onBlur={() => addNewEmptyRow()}
                          className="w-full rounded-md border border-gray-300 p-3"
                        />
                      </div>

                      {/* Prix Hors Taxe */}
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          Prix Hors Taxe
                        </label>
                        <input
                          type="number"
                          value={item.priceExclTax}
                          onChange={(e) => {
                            const newPriceExclTax = parseFloat(e.target.value);
                            setProductsWithQuantities((prevState) => {
                              const updatedProducts = [...prevState];
                              updatedProducts[index] = {
                                ...updatedProducts[index],
                                priceExclTax: newPriceExclTax,
                                total:
                                  newPriceExclTax *
                                  updatedProducts[index].quantity,
                              };
                              return updatedProducts;
                            });
                          }}
                          className="w-full rounded-md border border-gray-300 p-3"
                          placeholder="Price Excl. Tax"
                        />
                      </div>

                      {/* Total */}
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          Total
                        </label>
                        <input
                          type="text"
                          value={item.total}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                        />
                      </div>

                      {/* SKU */}
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={item.sku}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <h4 className="mb-6 text-lg font-semibold text-gray-800">
                    Total Amount
                  </h4>
                  {paymentTypes.map((payment, index) => (
                    <div
                      key={index}
                      className="mb-6 flex items-center space-x-4"
                    >
                      <select
                        value={payment.type}
                        onChange={(e) =>
                          handlePaymentTypeChange(index, e.target.value)
                        }
                        className="w-1/3 rounded-md border border-gray-300 p-3"
                      >
                        <option value="">Select Payment Type</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                        <option value="traite">Traite</option>
                      </select>
                      {payment.type && (
                        <input
                          type="number"
                          value={payment.amount || ""}
                          onChange={(e) =>
                            handlePaymentAmountChange(index, e.target.value)
                          }
                          className="w-1/3 rounded-md border border-gray-300 p-3"
                          placeholder="Amount"
                        />
                      )}

                      {payment.type && payment.type !== "cash" && (
                        <input
                          type="number"
                          value={payment.percentage}
                          onChange={(e) =>
                            handlePaymentPercentageChange(index, e.target.value)
                          }
                          className="w-1/3 rounded-md border border-gray-300 p-3"
                          placeholder="Percentage"
                        />
                      )}
                      <div className="flex w-full items-center space-x-2 sm:w-1/3 lg:w-1/4">
                        <label className="block w-1/3 text-sm font-medium text-gray-700">
                          R.Amount
                        </label>
                        <input
                          type="number"
                          value={remainingAmounts[index]?.toFixed(2) || "0.00"}
                          disabled
                          className="w-2/3 rounded-md border border-gray-300 bg-gray-100 p-3"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-6">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-800">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload File Section */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                Upload File
              </label>

              <div className="relative w-full">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-center text-gray-700 hover:bg-gray-200"
                >
                  📁 Choose File
                </label>
              </div>

              {uploadedFile && (
                <div className="mt-3 font-medium text-green-600">
                  ✅ File uploaded successfully!
                </div>
              )}
            </div>

            {/*comment*/}

            <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="type your comment"
                className="w-full rounded border p-2"
              />
              <button
                onClick={handleSubmitComments}
                className="mt-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md 
             transition-all duration-300 hover:bg-blue-700 focus:outline-none 
             focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                💾 Save Comment
              </button>

              {message && (
                <p className="mt-2 text-sm text-green-600">{message}</p>
              )}
            </div>
            <button onClick={handleDownloadPDF} className="neon-button">
              📄 Download PDF
            </button>
            <button onClick={handleSendEmail} className="neon-button">
              ✉️ Submit
            </button>
            <button className="neon-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;

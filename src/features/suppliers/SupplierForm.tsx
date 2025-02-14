import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { sendOrderEmail } from "./services/emailService";
import { Supplier, Product, EmailParams, Warehouse } from "./types/types";
import "./styles/NeonButton.css";
import { generatePDF } from "./services/pdfService";

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
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentPercentage, setPaymentPercentage] = useState<string>("");
  const [newPaymentType, setNewPaymentType] = useState<string>("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [newPaymentPercentage, setNewPaymentPercentage] = useState<string>("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [storedComments, setStoredComments] = useState([]);
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

  const [comments, setComments] = useState<
    { text: string; createdAt: string }[]
  >([]);
  const handleSubmitComments = async () => {
    if (comment.trim() === "") {
      setMessage("Veuillez entrer un commentaire valide.");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST", // Assurez-vous que c'est bien 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      console.log("Response:", response); // Ajoutez ce log pour vérifier la réponse

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setComment("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setMessage("Erreur lors de l'ajout du commentaire.");
    }
  };

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
  const isPaymentPercentageNot100 =
    paymentPercentage && parseFloat(paymentPercentage) !== 100;

  const totalAmount = productsWithQuantities.reduce(
    (acc, item) => acc + item.total,
    0,
  );
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) setUploadedFile(file);
  };
  const handlePaymentPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
      setPaymentPercentage(value);
      if (parseFloat(value) < 100) {
        const remainingPercentage = 100 - parseFloat(value);
        setRemainingAmount((totalAmount * remainingPercentage) / 100); // Calculer le montant restant
      } else {
        setRemainingAmount(0); // Si le pourcentage est à 100, il ne reste rien à payer
      }
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
  const handleNewPaymentPercentageChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
      setNewPaymentPercentage(value);
      const remainingPercentage = 100 - parseFloat(value);
      setRemainingAmount((totalAmount * remainingPercentage) / 100);
    }
  };
  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.company_name);
    setSelectedSupplier(supplier);
    onChange?.(supplier);
    resetFormFields();
  };

  const handleDownloadPDF = () => {
    if (selectedSupplier && selectedProducts.length > 0) {
      generatePDF(
        selectedSupplier,
        selectedProducts,
        quantities,
        totalPayment,
        selectedPaymentMode,
      );
    } else {
      toast.error(
        "Please select supplier and products before downloading the PDF.",
      );
    }
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

  const handleSubmitOrder = async () => {
    if (!selectedSupplier || selectedProducts.length === 0) {
      toast.error(
        "Please select a supplier and products before submitting the order.",
      );
      return;
    }

    const emailParams: EmailParams = {
      to_name: selectedSupplier?.company_name || "",
      from_name: "Your Company",
      to_email: selectedSupplier?.email || "",
      products: selectedProducts.map((product) => ({
        name: product.productName,
        quantity: quantities[product.id],
        price: product.productPrice,
      })),
      total_payment: totalPayment,
      payment_mode: selectedPaymentMode,
      delivery_date: "",
    };

    const emailSuccess = await sendOrderEmail(emailParams);

    if (emailSuccess) {
      toast.success("Order submitted successfully and email sent.");
    }
  };
  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 flex items-center pb-6">
              <p className="ml-4 text-xl font-bold">Select Supplier</p>
            </div>

            {/* Supplier Search Section */}
            <div className="box flex w-full justify-between rounded-lg bg-primary/5 p-4 dark:bg-bg3">
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

            {/* Product Selection Section */}
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
                                selectedSupplier?.manufacturer_id,
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
                                  updatedProducts[index].priceExclTax,
                              };
                              return updatedProducts;
                            });
                          }}
                          onBlur={() => addNewEmptyRow()}
                          className="w-full rounded-md border border-gray-300 p-3"
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

                {/* Total Amount Section */}
                <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <h4 className="mb-6 text-lg font-semibold text-gray-800">
                    Total Amount
                  </h4>

                  <div className="flex items-center justify-between space-x-6">
                    {/* Total Amount Display */}
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Payment Type Dropdown */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Type
                      </label>
                      <select
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-3"
                      >
                        <option value="">Select a payment type</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                        <option value="traite">Traite</option>
                      </select>
                    </div>

                    {/* Payment Percentage Field */}
                    {paymentType && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Percentage
                        </label>
                        <input
                          type="number"
                          value={paymentPercentage}
                          onChange={handlePaymentPercentageChange}
                          placeholder="Enter percentage"
                          className="w-full rounded-md border border-gray-300 p-3"
                        />
                      </div>
                    )}
                  </div>

                  {/* New Payment Type Section */}
                  {isPaymentPercentageNot100 && (
                    <div className="mt-6 flex items-center justify-between space-x-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          New Payment Type
                        </label>
                        <select
                          value={newPaymentType}
                          onChange={(e) => setNewPaymentType(e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-3"
                        >
                          <option value="">Select a payment type</option>
                          <option value="cheque">Cheque</option>
                          <option value="cash">Cash</option>
                          <option value="traite">Traite</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Payment Percentage for New Payment Type */}
                  {isPaymentPercentageNot100 && newPaymentType && (
                    <div className="mt-4 flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Percentage
                      </label>
                      <input
                        type="number"
                        value={
                          newPaymentPercentage ||
                          (
                            100 - parseFloat(paymentPercentage || "100")
                          ).toString()
                        }
                        onChange={handleNewPaymentPercentageChange}
                        placeholder="Enter percentage"
                        className="w-full rounded-md border border-gray-300 p-3"
                      />
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="mt-6">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-800">
                        First Payment ({paymentPercentage || 100}%)
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {(
                          totalAmount *
                          (parseFloat(paymentPercentage || "100") / 100)
                        ).toFixed(2)}
                      </span>
                    </div>

                    {isPaymentPercentageNot100 && (
                      <div className="mt-4 flex justify-between">
                        <span className="text-lg font-medium text-gray-800">
                          Remaining Payment (
                          {100 - parseFloat(paymentPercentage)}%)
                        </span>
                        <span className="text-lg font-semibold text-gray-800">
                          {remainingAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upload File Section */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
              {uploadedFile && (
                <div className="mt-3 font-medium text-green-600">
                  ✅ File uploaded successfully!
                </div>
              )}
            </div>

            {/* Comment Section */}
            <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Entrez votre commentaire"
              />
              <button onClick={handleSubmitComments}>
                Sauvegarder le commentaire
              </button>
              {message && <p>{message}</p>}
            </div>

            {/* Submit Order Section */}
            <div className="mt-6 grid grid-cols-4 items-center gap-6">
              <button onClick={handleDownloadPDF} className="neon-button">
                Download PDF
              </button>
              <button onClick={handleSubmitOrder} className="neon-button">
                Submit Order
              </button>
              <button onClick={handleSubmitOrder} className="neon-button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupplierForm;

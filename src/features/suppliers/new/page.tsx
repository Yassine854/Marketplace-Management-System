import { useState, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import {
  Supplier,
  Product,
  Warehouse,
  PaymentType,
  SimplifiedProduct,
} from "./utils/types";
import { generateOrderPDF } from "./utils/generatePdf";
import "@/features/suppliers/styles/NeonButton.css";
import jsPDF from "jspdf";
import { FaFileDownload } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { sendOrderEmail } from "./utils/emailService";
const SupplierForm = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>(
    {},
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );

  const [productRows, setProductRows] = useState([
    { productId: "", quantity: 0, sku: "", priceExclTax: 0, total: 0 },
  ]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [createdAt] = useState<Date>(new Date());
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [paymentPercentage, setPaymentPercentage] = useState<string>("");

  const [newPaymentType, setNewPaymentType] = useState<string>("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([
    { type: "", percentage: "", amount: "", date: new Date() },
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
  const [products, setProducts] = useState<SimplifiedProduct[]>([]);
  const totalPercentage = paymentTypes.reduce(
    (acc, payment) => acc + (parseFloat(payment.percentage) || 0),
    0,
  );
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      id: string;
    }[]
  >([]);

  const [fileList, setFileList] = useState<
    {
      name: string;
      url: string;
    }[]
  >([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersRes, warehousesRes, productsRes] = await Promise.all([
          fetch("/api/manufacturers"),
          fetch("/api/warehouse"),
          fetch("/api/products"),
        ]);

        const warehousesData = await warehousesRes.json();
        const validatedWarehouses = warehousesData.map((w: any) => ({
          warehouseId: w.warehouseId || w.warehouse_id,
          name: w.warehouseName || w.name,
          location: w.location,
          capacity: w.capacity,
          manager: w.manager,
        }));
        setWarehouses(validatedWarehouses);
        const productsResponse = await productsRes.json();
        if (!Array.isArray(productsResponse.products)) {
          throw new Error(
            "Format de données de produit invalide: " +
              JSON.stringify(productsResponse),
          );
        }

        const productsData = productsResponse.products;
        const validatedProducts: SimplifiedProduct[] = productsData.map(
          (p: any) => ({
            id: String(p.id),

            product_id: Number(p.product_id),

            sku: String(p.sku),

            name: String(p.name),

            price: Number(p.price),

            cost: p.cost ? Number(p.cost) : null,

            website_ids: Array.isArray(p.website_ids)
              ? p.website_ids.map(Number)
              : [],

            manufacturer: p.manufacturer ? Number(p.manufacturer) : null,

            supplierId: p.supplierId ? String(p.supplierId) : null,
          }),
        );

        setProducts(validatedProducts);

        const suppliersData = await suppliersRes.json();
        const validatedSuppliers = suppliersData
          .map((s: any) => ({
            manufacturer_id: s.manufacturerId || s.id || s.manufacturer_id,
            companyName: s.companyName || s.company_name,
            contact_name: s.contactName || s.contact_name,
            email: s.email,
            phone_number: s.phoneNumber || s.phone_number,
            postal_code: s.postalCode || s.postal_code,
            city: s.city,
            country: s.country,
            capital: s.capital,
          }))
          .filter((s: { manufacturer_id: any }) => s.manufacturer_id);
        setSuppliers(validatedSuppliers);
      } catch (error) {
        console.error("Data loading error::", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const remaining = totalAmount * ((100 - totalPercentage) / 100);
    setRemainingAmount(remaining);
  }, [paymentTypes, totalPercentage, totalAmount]);

  useEffect(() => {
    if (
      newPaymentType &&
      paymentPercentage &&
      parseFloat(paymentPercentage) < 100
    ) {
      const remainingPercentage = 100 - parseFloat(paymentPercentage);
      setPaymentPercentage(remainingPercentage.toString());
    }
  }, [newPaymentType, paymentPercentage]);

  useEffect(() => {
    const totalAllocated = paymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),

      0,
    );

    const remaining = totalAmount - totalAllocated;

    setRemainingAmount(Math.round(remaining * 100) / 100);
  }, [paymentTypes, totalAmount]);

  const handlePaymentTypeChange = (index: number, type: string) => {
    const updatedPaymentTypes = [...paymentTypes];
    updatedPaymentTypes[index].type = type;

    setPaymentTypes(updatedPaymentTypes);
  };
  const handlePaymentPercentageChange = (index: number, value: string) => {
    const newPercentage = Math.min(parseFloat(value) || 0, 100);

    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],

      percentage: newPercentage.toString(),

      amount: ((totalAmount * newPercentage) / 100).toFixed(2),
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.percentage || "0") || 0),

      0,
    );

    if (totalAllocated < 100 && index === updatedPayments.length - 1) {
      updatedPayments.push({
        type: "",

        percentage: "",

        amount: "",

        date: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };

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
        setUploadedFiles((prev) => [...prev, { id: data.fileId }]);

        setFileList((prev) => [
          ...prev,
          {
            name: data.fileName,

            url: data.url,
          },
        ]);

        toast.success("File uploaded successfully");
      } else {
        toast.error("File upload failed");
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
  }, [paymentPercentage, totalAmount]);

  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "UPDATE_REMAINING":
          return {
            ...prevState,

            remainingAmounts: action.payload,
          };

        default:
          return prevState;
      }
    },

    { remainingAmounts: [] },
  );
  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.companyName);
    setSelectedSupplier(supplier);
    resetFormFields();
  };

  const handleSaveOrder = async () => {
    try {
      if (!selectedSupplier) {
        toast.error("Supplier is required.");
        throw new Error("Supplier is required.");
      }
      if (!selectedWarehouse) {
        toast.error("Warehouse is required.");
        throw new Error("Warehouse is required");
      }
      if (!selectedState) {
        toast.error("Order state is required.");
        throw new Error("Order state is required");
      }
      if (productsWithQuantities.length === 0) {
        toast.error("At least one product must be added.");
        throw new Error("At least one product must be added");
      }
      if (
        paymentTypes.some(
          (p) => p.type && (!p.amount || parseFloat(p.amount) <= 0),
        )
      ) {
        toast.error("Each payment must have a valid amount.");
        throw new Error("Each payment must have a valid amount");
      }

      const orderData = {
        orderNumber: `PO-${Date.now()}`,
        manufacturerId: Number(selectedSupplier.manufacturer_id) || 0,
        warehouseId: Number(selectedWarehouse?.warehouseId) || 0,
        deliveryDate: new Date(deliveryDate).toISOString(),
        totalAmount: totalAmount,
        status: selectedState,
        comments: comment ? [{ content: comment }] : [],
        payments: paymentTypes
          .filter((payment) => payment.type && payment.amount)
          .map((payment) => ({
            paymentMethod: payment.type.toUpperCase(),
            amount: parseFloat(payment.amount) || 0,
            percentage: parseFloat(payment.percentage) || 0,
            date: payment.date,
          })),
        products: productsWithQuantities
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            id: item.id,
            name: item.product.name,
            quantity: item.quantity,
            priceExclTax: item.priceExclTax,
            total: item.total,
            sku: item.sku,
          })),
        files: uploadedFiles.map((file) => ({ id: file.id })),
      };

      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error saving");
      }

      const result = await response.json();
      toast.success("Purchase order saved successfully!");

      return result;
    } catch (error) {
      throw new Error("registration failed");
    }
  };

  const handleSelectWarehouse = (warehouseName: string): void => {
    const warehouse = warehouses.find((w) => w.name === warehouseName);
    if (warehouse && selectedSupplier) {
      setSelectedWarehouse(warehouse);

      const filteredProducts = products.filter((product) => {
        if (!product.manufacturer) return false;
        const productManufacturerId = Number(product.manufacturer);
        const supplierId = Number(selectedSupplier.manufacturer_id);
        return productManufacturerId === supplierId;
      });

      const updatedProducts = filteredProducts
        .map((product) => {
          const productData: Product = {
            id: product.id,
            product_id: product.product_id,
            sku: product.sku,
            skuPartner: null,
            name: product.name,
            price: product.price,
            cost: product.cost ?? null,
            website_ids: product.website_ids,
            manufacturer: product.manufacturer || null,
            description: null,
            image: null,
            url_key: null,
            created_at: null,
            updated_at: null,
            supplierId: null,
            pcb: null,
            weight: null,
            stock: null,
            promo: false,
            minimumQte: null,
            maximumQte: null,
            typePcbId: null,
            productTypeId: null,
            productStatusId: null,
            taxId: null,
            promotionId: null,
          };

          return {
            product: productData,
            quantity: 0,
            sku: product.sku,
            id: product.id,
            priceExclTax: product.price || 0,
            total: 0,
          };
        })
        .filter(
          (product): product is NonNullable<typeof product> => product !== null,
        );

      setProductsWithQuantities(updatedProducts);
    } else {
      console.error("Warehouse not found or supplier not selected");
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
  const handleSendEmail = async () => {
    try {
      await sendOrderEmail({
        supplier: selectedSupplier,

        warehouse: selectedWarehouse,

        products: productsWithQuantities,

        totalAmount,
        comment,
      });
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    }
  };
  const handlePaymentAmountChange = (index: number, value: string) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    if (numericValue !== "" && isNaN(numericValue)) return;

    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],
      amount: value,
      percentage:
        totalAmount !== 0
          ? (
              ((numericValue === "" ? 0 : numericValue) / totalAmount) *
              100
            ).toFixed(2)
          : "0",
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),
      0,
    );

    if (index === updatedPayments.length - 1 && totalAllocated < totalAmount) {
      updatedPayments.push({
        type: "",
        percentage: "",
        amount: "",
        date: new Date(),
      });
    }

    setPaymentTypes(updatedPayments);
  };

  const handleDownloadPDF = () => {
    if (productsWithQuantities.length === 0) {
      toast.error("Please add products before generating the PDF");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);

    generateOrderPDF(
      doc,
      selectedSupplier,
      selectedWarehouse,
      selectedState,
      productsWithQuantities,
      totalAmount,
      paymentTypes,
      deliveryDate,
      userName,
    );

    doc.save("order.pdf");
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

    dispatch({ type: "UPDATE_REMAINING", payload: updatedRemainingAmounts });
  }, [paymentTypes, totalAmount]);

  useEffect(() => {
    const newTotalAmount = productRows.reduce((acc, row) => {
      const product = productsWithQuantities.find(
        (p) => p.id === row.productId,
      );
      if (product) {
        return acc + row.quantity * product.priceExclTax;
      }
      return acc;
    }, 0);

    setTotalAmount(newTotalAmount);
  }, [productRows, productsWithQuantities]);
  const handleProductChange = (index: number, productId: string) => {
    const updatedRows = [...productRows];
    const selectedProduct = productsWithQuantities.find(
      (p) => p.id === productId,
    );

    if (selectedProduct) {
      updatedRows[index] = {
        ...updatedRows[index],
        productId: selectedProduct.id,
        sku: selectedProduct.sku,
        priceExclTax: selectedProduct.priceExclTax,
        quantity: 1,
        total: 1 * selectedProduct.priceExclTax,
      };

      const updatedProducts = productsWithQuantities.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, quantity: 1, total: selectedProduct.priceExclTax }
          : item,
      );
      setProductsWithQuantities(updatedProducts);

      if (index === updatedRows.length - 1) {
        updatedRows.push({
          productId: "",
          quantity: 0,
          sku: "",
          priceExclTax: 0,
          total: 0,
        });
      }

      setProductRows(updatedRows);
    }
  };
  const handleQuantityChange = (index: number, quantity: number) => {
    const qty = Math.max(quantity, 1);
    const updatedRows = [...productRows];
    updatedRows[index].quantity = quantity;

    const product = productsWithQuantities.find(
      (p) => p.id === updatedRows[index].productId,
    );

    if (product) {
      updatedRows[index].total = quantity * product.priceExclTax;

      const updatedProductsWithQuantities = productsWithQuantities.map(
        (item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: quantity,
              total: quantity * item.priceExclTax,
            };
          }
          return item;
        },
      );

      setProductsWithQuantities(updatedProductsWithQuantities);
    }

    if (quantity > 0 && index === updatedRows.length - 1) {
      updatedRows.push({
        productId: "",
        quantity: 0,
        sku: "",
        priceExclTax: 0,
        total: 0,
      });
    }

    setProductRows(updatedRows);
    const newTotalAmount = updatedRows.reduce((acc, row) => {
      const product = productsWithQuantities.find(
        (p) => p.id === row.productId,
      );
      if (product) {
        return acc + row.quantity * product.priceExclTax;
      }
      return acc;
    }, 0);

    setTotalAmount(newTotalAmount);
  };
  const getAvailableProducts = (currentIndex: number) => {
    return productsWithQuantities.filter((product) => {
      return !productRows.some(
        (row, rowIndex) =>
          rowIndex !== currentIndex && row.productId === product.id,
      );
    });
  };
  const handleSaveAndSendEmail = async () => {
    try {
      await handleSaveOrder();
      handleSendEmail();
      toast.success("Order saved and email sent successfully!");
    } catch (error) {
      toast.error("Failed to save order or send email.");
    }
  };
  const handleCancel = () => {
    setQuery("");

    setSelectedSupplier(null);

    setSelectedWarehouse(null);

    setProductRows([
      { productId: "", quantity: 0, sku: "", priceExclTax: 0, total: 0 },
    ]);

    setProductsWithQuantities([]);

    setPaymentTypes([
      { type: "", percentage: "", amount: "", date: new Date() },
    ]);

    setComment("");

    setSelectedState("");

    setDeliveryDate(new Date());

    setUploadedFiles([]);

    setFileList([]);

    setTotalAmount(0);

    setRemainingAmount(0);
  };
  const handlePaymentDateChange = (index: number, date: Date) => {
    const updatedPayments = [...paymentTypes];

    updatedPayments[index].date = date;

    setPaymentTypes(updatedPayments);
  };
  const { data: session } = useSession();

  if (!session?.user) {
    return <p>Unauthorized</p>;
  }
  const userName = session.user?.name || "Guest";
  return (
    <div className="mt-7 flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative mt-8 grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="rounded-lg border-2 border-gray-300 bg-white p-8 shadow-lg">
              <div className="bb-dashed mb-6 mt-9 flex items-center pb-6">
                <p className="ml-4 mt-6 text-xl font-bold">Select Supplier</p>
                <div
                  onClick={handleDownloadPDF}
                  className="ml-auto cursor-pointer text-2xl text-gray-700 hover:text-primary"
                  title="Download PDF"
                >
                  <FaFileDownload />
                </div>
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
                  {!selectedSupplier && suppliers.length > 0 && (
                    <ul className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {suppliers
                        .filter(
                          (supplier) =>
                            supplier.companyName
                              ?.toLowerCase()
                              .includes(query.toLowerCase()),
                        )
                        .map((supplier) => (
                          <li
                            key={supplier.manufacturerId}
                            onClick={() => handleSelectSupplier(supplier)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          >
                            {supplier.companyName}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Supplier Details Section */}
              {selectedSupplier && (
                <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <h3 className="mb-4 text-xl font-semibold">
                    Supplier Details
                  </h3>
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
                          value={selectedSupplier.companyName}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                        />
                      </div>

                      {/* Select Warehouse */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Warehouse
                        </label>
                        <select
                          value={selectedWarehouse?.name || ""}
                          onChange={(e) =>
                            handleSelectWarehouse(e.target.value)
                          }
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
                          <option value="IN_PROGRESS"> In progress </option>
                          <option value="READY"> Ready</option>
                          <option value="DELIVERED"> Delivered </option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={deliveryDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setDeliveryDate(new Date(e.target.value))
                          }
                          className="w-full rounded-md border border-gray-300 p-2"
                        />
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
                    {productRows.map((row, index) => (
                      <div
                        key={index}
                        className="mb-6 flex items-center justify-between gap-6"
                      >
                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Product
                          </label>
                          <select
                            value={row.productId || ""}
                            onChange={(e) =>
                              handleProductChange(index, e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 p-3"
                          >
                            <option value="">Select a product</option>
                            {getAvailableProducts(index).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.product.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantité */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-md border border-gray-300 p-3"
                          />
                        </div>

                        {/* Prix Hors Taxe */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Price exc.tax
                          </label>
                          <input
                            type="number"
                            value={
                              productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.priceExclTax
                            }
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3"
                          />
                        </div>

                        {/* Total */}
                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Total
                          </label>
                          <input
                            type="text"
                            value={(
                              row.quantity *
                              (productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.priceExclTax || 0)
                            ).toFixed(2)}
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
                            value={
                              productsWithQuantities.find(
                                (p) => p.id === row.productId,
                              )?.sku || ""
                            }
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
                    {paymentTypes.some((payment) => payment.type) && (
                      <div className="mb-4 grid grid-cols-5 gap-4 px-2">
                        <span className="text-sm font-medium text-gray-700">
                          Type
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Percentage
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Amount
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Payment date
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Remaining
                        </span>
                      </div>
                    )}
                    {paymentTypes.map((payment, index) => (
                      <div key={index} className="mb-6 grid grid-cols-5 gap-4">
                        <select
                          value={payment.type}
                          onChange={(e) =>
                            handlePaymentTypeChange(index, e.target.value)
                          }
                          className="rounded-md border border-gray-300 p-3"
                        >
                          <option value="0">Select a payment method</option>
                          <option value="CHEQUE">Cheque</option>
                          <option value="cash">Cash</option>
                          <option value="TRAITE">Traite</option>
                        </select>
                        {payment.type && (
                          <input
                            type="number"
                            value={payment.percentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPaymentTypes((prev) => {
                                const updatedPayments = [...prev];
                                updatedPayments[index].percentage = value;
                                return updatedPayments;
                              });
                            }}
                            onBlur={() =>
                              handlePaymentPercentageChange(
                                index,
                                payment.percentage,
                              )
                            }
                            className="rounded-md border border-gray-300 p-3"
                            placeholder="Percentage"
                            min="0"
                            max="100"
                            step="any"
                          />
                        )}
                        {payment.type && (
                          <input
                            type="number"
                            value={payment.amount || ""}
                            onChange={(e) =>
                              handlePaymentAmountChange(index, e.target.value)
                            }
                            className="rounded-md border border-gray-300 p-3"
                            placeholder="Amount"
                            step="any"
                            min="0"
                          />
                        )}
                        {payment.type && (
                          <input
                            type="date"
                            value={payment.date.toISOString().split("T")[0]}
                            onChange={(e) => {
                              const newDate = new Date(e.target.value);
                              handlePaymentDateChange(index, newDate);
                            }}
                            className="rounded-md border border-gray-300 p-3"
                          />
                        )}
                        <input
                          type="number"
                          value={remainingAmount.toFixed(2) || "0.00"}
                          disabled
                          className="rounded-md border border-gray-300 bg-gray-100 p-3"
                        />
                      </div>
                    ))}
                    <div className="mt-6 flex justify-between">
                      <span className="text-lg font-medium text-gray-800">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload File Section */}
              <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
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
              </div>

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

                {message && (
                  <p className="mt-2 text-sm text-green-600">{message}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button onClick={handleCancel} className="neon-button">
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndSendEmail}
                  className="neon-button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;

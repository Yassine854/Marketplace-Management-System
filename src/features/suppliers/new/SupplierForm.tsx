import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Supplier, Product, Warehouse } from "./types/types";
import "./styles/NeonButton.css";
import emailjs from "emailjs-com";
import jsPDF from "jspdf";
import { PrismaClient } from "@prisma/client";

import { useSession } from "next-auth/react";
const prisma = new PrismaClient();

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
  const [paymentTypes, setPaymentTypes] = useState<
    { type: string; percentage: string; amount: string }[]
  >([{ type: "", percentage: "", amount: "" }]);
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
          warehouse_id: w.warehouseId ?? w.warehouse_id,
          name: w.warehouseName || w.name,
          location: w.location,
          capacity: w.capacity,
          manager: w.manager,
        }));
        setWarehouses(validatedWarehouses);

        const productsData = await productsRes.json();
        const validatedProducts = productsData.map((p: any) => ({
          id: p.product_id,
          sku: p.sku,
          name: p.name,
          price: p.price,
          website_ids: p.website_ids?.map(Number) || [],
          manufacturer: p.manufacturer,
        }));
        setProducts(validatedProducts);

        const suppliersData = await suppliersRes.json();
        const validatedSuppliers = suppliersData.map((s: any) => ({
          manufacturer_id: s.manufacturerId ?? s.manufacturer_id,
          companyName: s.companyName || s.companyName,
          contact_name: s.contactName || s.contact_name,
          email: s.email,
          phone_number: s.phoneNumber ?? s.phone_number,
          postal_code: s.postalCode ?? s.postal_code,
          city: s.city,
          country: s.country,
          capital: s.capital,
        }));
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
  }, [paymentTypes, totalPercentage]);

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

  const [remainingAmounts, setRemainingAmounts] = useState([totalAmount]);

  useEffect(() => {
    const totalAllocated = paymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),
      0,
    );
    setRemainingAmount(totalAmount - totalAllocated);
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
      amount: ((totalAmount * newPercentage) / 100).toString(),
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.percentage || "0") || 0),
      0,
    );

    const remainingPercentage = 100 - totalAllocated;

    if (remainingPercentage > 0 && index === updatedPayments.length - 1) {
      updatedPayments.push({
        type: "",
        percentage: remainingPercentage.toFixed(2),
        amount: "",
      });
    }

    updatedPayments.forEach((payment, i) => {
      if (i !== index && i !== updatedPayments.length - 1) {
        payment.percentage = payment.percentage;
      }
    });

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
      console.log("Response from API:", data);

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
  }, [paymentPercentage]);

  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.companyName);
    setSelectedSupplier(supplier);
    onChange?.(supplier);
    resetFormFields();
  };

  enum PaymentMethod {
    CHEQUE = "CHEQUE",
    CREDIT = "CREDIT",
    TRAITE = "TRAITE",
    CASH = "CASH",
  }

  const handleSaveOrder = async () => {
    if (
      !selectedSupplier ||
      !selectedWarehouse ||
      productsWithQuantities.length === 0
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const orderData = {
      orderNumber: `PO-${Date.now()}`,
      manufacturerId: Number(selectedSupplier.manufacturer_id) || 0,
      warehouseId: Number(selectedWarehouse.warehouse_id) || 0,
      deliveryDate: new Date(deliveryDate).toISOString(),
      totalAmount: totalAmount,
      status: selectedState,
      comments: comment ? [{ content: comment }] : [],
      payments: paymentTypes

        .filter((payment) => payment.type && payment.amount) // Filtrer les paiements valides

        .map((payment) => ({
          paymentMethod: payment.type.toUpperCase() as PaymentMethod,

          amount: parseFloat(payment.amount) || 0,

          percentage: parseFloat(payment.percentage) || 0,
        })),
      products: productsWithQuantities
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          id: item.id,
          name: item.product.name,
          quantity: item.quantity,
          priceExclTax: item.priceExclTax,
          total: item.total,
        })),
      files: uploadedFiles.map((file) => ({ id: file.id })),
    };

    console.log("Données de la commande avant envoi:", orderData);
    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Error saving");

      const result = await response.json();

      toast.success("Order successfully registered!");

      console.log("Purchase Order Saved:", result);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Registration failed.");
    }
  };
  const handleSelectWarehouse = (warehouseName: string): void => {
    const warehouse = warehouses.find((w) => w.name === warehouseName);

    if (warehouse) {
      setSelectedWarehouse(warehouse);

      console.log("Selected Warehouse:", warehouse);
      console.log("All Products:", products);

      const filteredProducts = products.filter(
        (product) =>
          product.website_ids.includes(warehouse.warehouse_id) &&
          product.manufacturer === selectedSupplier?.manufacturer_id.toString(),
      );

      console.log("Filtered Products:", filteredProducts);

      const updatedProducts = filteredProducts
        .map((product) => {
          if (!product || !product.id) {
            console.error("Product is undefined or missing id:", product);
            return null;
          }
          return {
            product: {
              id: product.id.toString(),
              product_id: product.product_id,
              sku: product.sku,
              name: product.name,
              price: product.price,
              website_ids: product.website_ids,
              manufacturer: product.manufacturer,
            },
            quantity: 0,
            sku: product.sku,
            id: product.id.toString(),
            priceExclTax: product.price || 0,
            total: 0,
          };
        })
        .filter(
          (product): product is NonNullable<typeof product> => product !== null,
        ); // Type guard to remove nulls
      setProductsWithQuantities(updatedProducts);
    } else {
      console.error("Warehouse not found:", warehouseName);
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
  const handleSendEmail = () => {
    if (
      !selectedSupplier ||
      !selectedWarehouse ||
      productsWithQuantities.length === 0
    ) {
      toast.error("Please complete all fields before sending an email");

      return;
    }

    const templateParams = {
      supplierName: selectedSupplier?.companyName || "Unknown Supplier",
      warehouse: selectedWarehouse?.name || "Unknown Warehouse",
      totalAmount: totalAmount?.toFixed(2) || "0.00",
      remainingAmount: remainingAmount?.toFixed(2) || "0.00",
      comment: comment || "No comment provided",

      products: productsWithQuantities.map((item) => ({
        productName: item.product.name || "Unknown Product",
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
      .then(() => {
        toast.success("Email sent successfully!");
      })
      .catch(() => {
        toast.error("Failed to send email. Please try again.");
      });
  };

  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmount = Math.min(parseFloat(value) || 0, totalAmount);
    const updatedPaymentTypes = [...paymentTypes];
    const newPercentage =
      totalAmount !== 0 ? (newAmount / totalAmount) * 100 : 0;

    updatedPaymentTypes[index] = {
      ...updatedPaymentTypes[index],
      amount: newAmount.toString(),
      percentage: newPercentage.toFixed(2),
    };

    const totalAllocated = updatedPaymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),
      0,
    );

    if (
      totalAllocated < totalAmount &&
      index === updatedPaymentTypes.length - 1
    ) {
      updatedPaymentTypes.push({
        type: "",
        percentage: newPercentage.toFixed(2),
        amount: "",
      });
    }

    setPaymentTypes(updatedPaymentTypes);
    setRemainingAmount(totalAmount - totalAllocated);
  };
  const generateOrderPDF = (
    doc: jsPDF,

    supplier: Supplier | null,

    warehouse: Warehouse | null,

    state: string,

    products: typeof productsWithQuantities,

    total: number,

    paymentTypes: any[],

    remainingAmount: number,

    deliveryDate: Date,
    userName: string,
  ) => {
    const lineHeight = 7;

    const margin = 10;

    const pageWidth = doc.internal.pageSize.getWidth();

    let yOffset = margin;
    doc.setFontSize(12);

    yOffset += lineHeight;
    const headerStyle = {
      fontSize: 18,

      fontStyle: "bold" as const,

      textColor: [0, 0, 0] as [number, number, number],
    };

    const subHeaderStyle = {
      fontSize: 14,

      fontStyle: "bold" as const,

      textColor: [0, 0, 0] as [number, number, number],
    };

    const bodyStyle = {
      fontSize: 12,

      textColor: [51, 51, 51] as [number, number, number],
    };
    doc.setFontSize(headerStyle.fontSize);

    doc.setFont("helvetica", headerStyle.fontStyle);

    doc.text("Order Details", margin, yOffset);

    yOffset += lineHeight * 2;
    doc.setFontSize(bodyStyle.fontSize);

    doc.setTextColor(...bodyStyle.textColor);

    doc.setFont("helvetica", "normal");

    const details = [
      `Supplier: ${supplier?.companyName || "Not specified"}`,

      `Warehouse: ${warehouse?.name || "Not specified"}`,

      `Order Date: ${new Date().toLocaleDateString()}`,

      `Delivery Date: ${deliveryDate.toLocaleDateString()}`,

      `Status: ${state || "Not specified"}`,
    ];
    details.forEach((detail) => {
      doc.text(detail, margin, yOffset);

      yOffset += lineHeight;
    });
    yOffset += lineHeight;

    doc.line(margin, yOffset, pageWidth - margin, yOffset);

    yOffset += lineHeight * 2;

    doc.setFontSize(subHeaderStyle.fontSize);

    doc.setTextColor(...subHeaderStyle.textColor);

    doc.setFont("helvetica", subHeaderStyle.fontStyle);

    doc.text("Ordered Products:", margin, yOffset);

    yOffset += lineHeight * 1.5;

    doc.setFontSize(bodyStyle.fontSize);

    doc.setTextColor(...bodyStyle.textColor);

    doc.setFont("helvetica", "bold");

    const columns = [
      { text: "Product", x: margin },

      { text: "Quantity", x: 70 },

      { text: "Unit Price", x: 100 },

      { text: "Total", x: 140 },
    ];

    columns.forEach((col) => doc.text(col.text, col.x, yOffset));

    yOffset += lineHeight;
    doc.setLineWidth(0.1);

    doc.line(margin, yOffset, pageWidth - margin, yOffset);

    yOffset += lineHeight;
    doc.setFont("helvetica", "normal");

    products

      .filter((item) => item.quantity > 0)

      .forEach((item) => {
        const startY = yOffset;

        let maxHeight = lineHeight;
        const productLines = doc.splitTextToSize(item.product.name, 60);

        productLines.forEach((line: string, i: number) => {
          doc.text(line, margin, yOffset + i * lineHeight);
        });

        maxHeight = Math.max(maxHeight, productLines.length * lineHeight);

        doc.text(`${item.quantity}`, 70, startY);

        doc.text(`${item.priceExclTax.toFixed(2)} DT`, 100, startY);

        doc.text(`${item.total.toFixed(2)} DT`, 140, startY);

        yOffset += maxHeight + lineHeight / 2;
      });

    yOffset += lineHeight;

    doc.setFontSize(subHeaderStyle.fontSize);

    doc.setFont("helvetica", subHeaderStyle.fontStyle);

    doc.text(`Total Amount: ${total.toFixed(2)} DT`, margin, yOffset);

    yOffset += lineHeight * 2;

    doc.text("Payment Details:", margin, yOffset);

    yOffset += lineHeight * 1.5;

    doc.setFontSize(bodyStyle.fontSize);

    doc.setFont("helvetica", "normal");

    paymentTypes.forEach((payment, index) => {
      if (payment.type && payment.amount) {
        doc.text(
          `${payment.type}: ${payment.percentage}% (${parseFloat(
            payment.amount,
          ).toFixed(2)} DT)`,

          margin,

          yOffset + index * lineHeight,
        );
      }
    });

    yOffset += paymentTypes.length * lineHeight + lineHeight;

    doc.setLineWidth(0.1);

    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += lineHeight;
    doc.text(`Made by ${userName}`, margin, yOffset);
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
      remainingAmount,
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

    setRemainingAmounts(updatedRemainingAmounts);
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
        total: updatedRows[index].quantity * selectedProduct.priceExclTax,
      };

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
    } else {
      console.error("Produit non trouvé pour l'ID:", productId);
    }
  };
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedRows = [...productRows];
    updatedRows[index].quantity = quantity;

    // Trouver le produit correspondant dans productsWithQuantities
    const product = productsWithQuantities.find(
      (p) => p.id === updatedRows[index].productId,
    );

    if (product) {
      // Mettre à jour le total pour cette ligne
      updatedRows[index].total = quantity * product.priceExclTax;

      // Mettre à jour productsWithQuantities
      const updatedProductsWithQuantities = productsWithQuantities.map(
        (item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: quantity, // Mettre à jour la quantité
              total: quantity * item.priceExclTax, // Mettre à jour le total
            };
          }
          return item;
        },
      );

      setProductsWithQuantities(updatedProductsWithQuantities);
    }

    // Ajouter une nouvelle ligne si la quantité est > 0 et que c'est la dernière ligne
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

    // Recalculer le totalAmount
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
  const { data: session } = useSession();

  if (!session?.user) {
    return <p>Unauthorized</p>;
  }
  const userName = session.user?.name || "Guest";
  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">Select Supplier</p>
            </div>
            <div className="box flex w-full justify-between rounded-lg ">
              <p>Made by {userName} </p>
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
                          key={supplier.manufacturer_id}
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
                        value={selectedSupplier.companyName}
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
                        <option value="IN_PROGRESS"> In progress </option>
                        <option value="READY"> Ready</option>
                        <option value="DELIVERED"> Delivered </option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    <label>
                      Delivery Date:
                      <input
                        type="date"
                        value={deliveryDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                          setDeliveryDate(new Date(e.target.value))
                        }
                      />
                    </label>
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
                      {/* Dropdown pour le produit */}
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
                            handleQuantityChange(index, Number(e.target.value))
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
                        <option value="0">Select a payment method</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="ESPECES">Cash</option>
                        <option value="TRAITE">Traite</option>
                      </select>
                      {payment.type && payment.type !== "cash" && (
                        <input
                          type="number"
                          value={payment.percentage}
                          onBlur={() => {
                            handlePaymentPercentageChange(
                              index,
                              payment.percentage,
                            );
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPaymentTypes((prev) => {
                              const updatedPayments = [...prev];

                              updatedPayments[index].percentage = value;

                              return updatedPayments;
                            });
                          }}
                          className="w-1/3 rounded-md border border-gray-300 p-3"
                          placeholder="Percentage"
                        />
                      )}
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

                      <div className="flex w-full items-center space-x-2 sm:w-1/3 lg:w-1/4">
                        <label className="block w-1/3 text-sm font-medium text-gray-700">
                          R.Amount
                        </label>
                        <input
                          type="number"
                          value={remainingAmount.toFixed(2) || "0.00"}
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
            <button onClick={handleDownloadPDF} className="neon-button">
              📄 Download PDF
            </button>
            <button onClick={handleSendEmail} className="neon-button">
              ✉️ Submit
            </button>
            <button onClick={handleSaveOrder} className="neon-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;

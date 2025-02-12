import { useState, useEffect, ChangeEvent, useRef } from "react";
import toast from "react-hot-toast";
import { DatePicker } from "@heroui/react";
import Select, { MultiValue } from "react-select";
import "./styles/NeonButton.css";
import { sendOrderEmail } from "./services/emailService";
import { Supplier, Product, EmailParams } from "./types/types";
import jsPDF from "jspdf";

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
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data: { suppliers: Supplier[]; products: Product[] }) => {
        setSuppliers(data.suppliers);
        setProducts(data.products);
      })
      .catch((error: Error) => console.error("Error loading data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectSupplier = (supplier: Supplier): void => {
    setQuery(supplier.company_name);
    setSelectedSupplier(supplier);
    onChange?.(supplier);
    resetFormFields();
  };

  const resetFormFields = (): void => {
    setQuantities({});
    setSelectedProducts([]);
    setTotalPayment(0);
    setSelectedPaymentMode("");
    setDeliveryDate(null);
  };

  const handleQuantityChange = (product: Product, value: number) => {
    const orderedQty = Math.max(value, 1);
    const maxQuantity = Math.max(
      ...product.warehouses.map((warehouse) => warehouse.quantity),
    );
    if (orderedQty > maxQuantity) {
      toast.error(
        `Quantity exceeds available stock. Max available quantity: ${maxQuantity}`,
        {
          duration: 4000,
          style: { background: "#ff9800", color: "#fff", fontWeight: "bold" },
        },
      );
      return;
    }
    setQuantities((prev) => {
      const updatedQuantities = { ...prev, [product.id]: orderedQty };
      // Recalculate total payment when quantity changes
      const total = selectedProducts.reduce((acc, product) => {
        const qty = updatedQuantities[product.id] || 0;
        return acc + product.productPrice * qty;
      }, 0);
      setTotalPayment(total);
      return updatedQuantities;
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (
      selectedSupplier &&
      selectedProducts.length > 0 &&
      selectedPaymentMode &&
      deliveryDate
    ) {
      const productsDetailsText = selectedProducts
        .map((product) => {
          const quantity = quantities[product.id] || 0;
          return `- **Product:** ${product.productName}\n- **Quantity:** ${quantity}\n- **Price:** ${product.productPrice}\n`;
        })
        .join("\n");

      const templateParams: EmailParams = {
        to_name: selectedSupplier.contact_name,
        from_name: "Kamioun",
        to_email: selectedSupplier.email,
        products: productsDetailsText,
        total_payment: totalPayment,
        payment_mode: selectedPaymentMode,
        delivery_date: deliveryDate.toLocaleDateString(),
      };

      const emailSent: boolean = await sendOrderEmail(templateParams);

      if (emailSent) {
        resetFormFields();
        setSelectedSupplier(null);
        setQuery("");
      }
    } else {
      toast.error("Please complete all fields before submitting.", {
        duration: 4000,
        style: { background: "#ff9800", color: "#fff", fontWeight: "bold" },
      });
    }
  };

  const handleDownloadPDF = (): void => {
    if (!selectedSupplier) {
      toast.error("No supplier selected!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Order for ${selectedSupplier.company_name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Contact: ${selectedSupplier.contact_name}`, 20, 30);
    doc.text(`Email: ${selectedSupplier.email}`, 20, 40);
    let yPosition = 50;
    doc.text("Products Ordered:", 20, yPosition);
    yPosition += 10;

    selectedProducts.forEach((product) => {
      const quantity = quantities[product.id] || 0;
      const totalPrice = (product.productPrice * quantity).toFixed(2);
      doc.text(
        `${product.productName} - ${quantity} x ${product.productPrice} = ${totalPrice} DT`,
        20,
        yPosition,
      );
      yPosition += 10;
    });

    doc.text(`Total Payment: ${totalPayment.toFixed(2)} DT`, 20, yPosition);
    yPosition += 10;

    doc.text(`Payment Mode: ${selectedPaymentMode}`, 20, yPosition);
    yPosition += 10;
    doc.text(
      `Delivery Date: ${deliveryDate?.toLocaleDateString()}`,
      20,
      yPosition,
    );

    const fileName = `Order_${selectedSupplier.company_name}.pdf`;
    doc.save(fileName);
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.company_name.toLowerCase().includes(query.toLowerCase()) &&
      supplier.manufacturer_id !== selectedSupplier?.manufacturer_id,
  );

  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 flex items-center pb-6">
              <p className="ml-4 text-xl font-bold">Select Supplier</p>
            </div>

            {isLoading ? (
              <RectangleSkeleton />
            ) : (
              <div className="box flex w-full justify-between rounded-lg bg-primary/5 p-4 dark:bg-bg3">
                <div className="relative flex w-full flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Search and select supplier..."
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setQuery(e.target.value);
                      setSelectedSupplier(null);
                    }}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  {query && filteredSuppliers.length > 0 && (
                    <ul className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {filteredSuppliers.map((supplier) => (
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
            )}

            {selectedSupplier && (
              <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold">Supplier Details</h3>
                <form>
                  <InputField
                    label="Company Name"
                    value={selectedSupplier.company_name}
                    disabled
                  />
                  <InputField
                    label="Contact Name"
                    value={selectedSupplier.contact_name}
                    disabled
                  />
                  <InputField
                    label="Email"
                    value={selectedSupplier.email}
                    disabled
                  />

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Products
                    </label>
                    <Select
                      isMulti
                      options={products
                        .filter(
                          (prod) =>
                            prod.manufacturer_id ===
                            selectedSupplier.manufacturer_id,
                        )
                        .map((prod) => ({
                          value: prod.id,
                          label: prod.productName,
                          ...prod,
                        }))}
                      onChange={(selectedOptions: MultiValue<any>) => {
                        setSelectedProducts(
                          selectedOptions.map((option) => option),
                        );
                      }}
                      className="mt-1 w-full"
                    />
                  </div>

                  {selectedProducts.map((product) => (
                    <div key={product.id} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {product.productName} (SKU: {product.sku})
                      </label>
                      <ul className="mb-2 text-sm text-gray-600">
                        {product.warehouses.map((warehouse) => (
                          <li key={warehouse.name}>
                            {warehouse.name}:{" "}
                            <strong>{warehouse.quantity}</strong> units
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          placeholder="Quantity to order"
                          value={quantities[product.id] || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              product,
                              Number(e.target.value),
                            )
                          }
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                        <div className="text-sm text-gray-600">
                          <strong>Cost:</strong> {product.productPrice} x{" "}
                          {quantities[product.id] || 0} ={" "}
                          {(
                            product.productPrice * (quantities[product.id] || 0)
                          ).toFixed(2)}{" "}
                          DT
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalPayment > 0 && (
                    <InputField
                      label="Total Payment"
                      value={totalPayment.toString()}
                      disabled
                    />
                  )}

                  {totalPayment > 0 && (
                    <>
                      <div className="mb-4" ref={datePickerRef}>
                        <DatePicker
                          label="Delivery Date"
                          defaultValue={null}
                          onChange={(date) =>
                            setDeliveryDate(date ? new Date(date) : null)
                          }
                          showMonthAndYearPickers
                          hideTimeZone
                          variant="bordered"
                          className="w-full"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Mode
                        </label>
                        <select
                          value={selectedPaymentMode}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setSelectedPaymentMode(e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="">Select a payment mode</option>
                          {selectedSupplier.payment_modes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="neon-button"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="neon-button mt-4"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      Download PDF
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`mt-1 w-full rounded-md border border-gray-300 p-2 ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

const RectangleSkeleton = (): JSX.Element => (
  <div className="h-12 w-full animate-pulse rounded-lg bg-gray-300"></div>
);

export default SupplierForm;

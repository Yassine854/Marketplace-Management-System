import { useState, useEffect, ChangeEvent, useRef } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { DatePicker } from "@heroui/react";
import "@/styles/NeonButton.css";

type Supplier = {
  manufacturer_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number?: string;
  city?: string;
  payment_modes: string[];
};

type Product = {
  id: string;
  productName: string;
  productPrice: string;
  sku: string;
  manufacturer_id: string;
};

const SupplierSelector = ({
  onChange,
}: {
  onChange?: (supplier: Supplier) => void;
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const productSelectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        setSuppliers(data.suppliers);
        setProducts(data.products);
      })
      .catch((error) => console.error("Error loading data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProduct && quantity > 0) {
      setTotalPayment(Number(selectedProduct.productPrice) * quantity);
    } else {
      setTotalPayment(0);
    }
  }, [selectedProduct, quantity]);

  const handleSelectSupplier = (supplier: Supplier) => {
    setQuery(supplier.company_name);
    setSelectedSupplier(supplier);
    onChange?.(supplier);
    resetFormFields();

    setTimeout(() => {
      productSelectRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  const resetFormFields = () => {
    setQuantity(0);
    setSelectedProduct(null);
    setTotalPayment(0);
    setSelectedPaymentMode("");
    setDeliveryDate(null);
  };

  const handleSubmit = () => {
    if (
      selectedSupplier &&
      selectedProduct &&
      quantity > 0 &&
      selectedPaymentMode &&
      deliveryDate
    ) {
      const templateParams = {
        to_name: selectedSupplier.contact_name,
        from_name: "Kamioun",
        to_email: selectedSupplier.email,
        product_name: selectedProduct.productName,
        quantity,
        total_payment: totalPayment,
        payment_mode: selectedPaymentMode,
        delivery_date: deliveryDate.toLocaleDateString(),
      };

      const loadingToast = toast.loading("Email sending in progress...");

      emailjs
        .send(
          "service_z1bkm7y",
          "template_b63ikd2",
          templateParams,
          "1I-USeEEq-xcp9edT",
        )
        .then(() => {
          toast.success("Order validated and email sent successfully!", {
            id: loadingToast,
            duration: 4000,
            style: { background: "#4caf50", color: "#fff", fontWeight: "bold" },
          });
          resetFormFields();
          setSelectedSupplier(null);
          setQuery("");
        })
        .catch(() => {
          toast.error("Error sending email.", {
            id: loadingToast,
            duration: 4000,
            style: { background: "#f44336", color: "#fff", fontWeight: "bold" },
          });
        });
    } else {
      toast.error("Please complete all fields before submitting.", {
        duration: 4000,
        style: { background: "#ff9800", color: "#fff", fontWeight: "bold" },
      });
    }
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
                  {selectedSupplier.phone_number && (
                    <InputField
                      label="Phone Number"
                      value={selectedSupplier.phone_number}
                      disabled
                    />
                  )}
                  {selectedSupplier.city && (
                    <InputField
                      label="City"
                      value={selectedSupplier.city}
                      disabled
                    />
                  )}

                  <div className="mb-4" ref={productSelectRef}>
                    <label className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      value={selectedProduct?.productName || ""}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const product = products.find(
                          (p) =>
                            p.productName === e.target.value &&
                            p.manufacturer_id ===
                              selectedSupplier.manufacturer_id,
                        );
                        setSelectedProduct(product || null);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a product</option>
                      {products
                        .filter(
                          (prod) =>
                            prod.manufacturer_id ===
                            selectedSupplier.manufacturer_id,
                        )
                        .map((prod) => (
                          <option key={prod.id} value={prod.productName}>
                            {prod.productName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <InputField
                    label="Quantity"
                    type="number"
                    value={quantity.toString()}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setQuantity(Number(e.target.value))
                    }
                    onBlur={() =>
                      totalPayment > 0 &&
                      datePickerRef.current?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                  />

                  {selectedProduct && (
                    <InputField
                      label="SKU"
                      value={selectedProduct.sku}
                      disabled
                    />
                  )}
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
                          onChange={(date) => {
                            if (date) {
                              const formattedDate = new Date(date);
                              setDeliveryDate(formattedDate);
                            } else {
                              setDeliveryDate(null);
                            }
                          }}
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
                          onChange={(e) =>
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

                  <div className="flex justify-end">
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

const RectangleSkeleton = () => (
  <div className="h-12 w-full animate-pulse rounded-lg bg-gray-300"></div>
);

export default SupplierSelector;

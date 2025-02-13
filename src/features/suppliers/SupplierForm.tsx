import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { sendOrderEmail } from "./services/emailService";
import { Supplier, Product, EmailParams, Warehouse } from "./types/types";
import "./styles/NeonButton.css";

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
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<string>("");
  const [createdAt] = useState<Date>(new Date());
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

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
          quantity: 1,
          sku: "",
          id: `new-product-${Date.now()}`,
          priceExclTax: 0,
          total: 0,
        },
      ]);
    }
  };

  const handleQuantityChange = (productId: string, quantity: number): void => {
    setProductsWithQuantities((prevState) => {
      const updatedProducts = prevState.map((item) => {
        if (item.id === productId) {
          const newTotal = item.priceExclTax * quantity;
          return { ...item, quantity, total: newTotal };
        }
        return item;
      });

      if (quantity !== 1) {
        const newProductWithQuantity = {
          product: {
            id: "",
            productName: "",
            productPrice: 0,
            manufacturer_id: "",
            sku: "",
            warehouses: [],
          },
          quantity: 1,
          sku: "",
          id: "",
          priceExclTax: 0,
          total: 0,
        };
        updatedProducts.push(newProductWithQuantity);
      }

      const newTotalPayment = updatedProducts.reduce(
        (total, item) => total + item.total,
        0,
      );
      setTotalPayment(newTotalPayment);

      return updatedProducts;
    });
  };

  const resetFormFields = (): void => {
    setQuantities({});
    setSelectedProducts([]);
    setTotalPayment(0);
    setSelectedPaymentMode("");
    setDeliveryDate(null);
    setSelectedWarehouse(null);
    setSelectedState("");
    setProductsWithQuantities([]);
  };

  const handleSelectState = (state: string): void => {
    setSelectedState(state);
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

  const handleSubmit = async (): Promise<void> => {
    if (
      selectedSupplier &&
      productsWithQuantities.length > 0 &&
      selectedPaymentMode &&
      deliveryDate &&
      selectedWarehouse &&
      selectedState
    ) {
      const productsDetailsText = productsWithQuantities
        .map((item) => {
          const totalPrice = item.product.productPrice * item.quantity;
          return `- **Product:** ${item.product.productName}\n- **Quantity:** ${item.quantity}\n- **Price:** ${item.product.productPrice}\n- **Total Price:** ${totalPrice}\n`;
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

  const handleSelectProduct = (selectedProductId: string) => {
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    );

    if (selectedProduct) {
      const existingProduct = productsWithQuantities.find(
        (item) => item.id === selectedProduct.id,
      );

      if (!existingProduct) {
        const newProductWithQuantity = {
          product: selectedProduct,
          quantity: 1,
          sku: selectedProduct.sku,
          id: selectedProduct.id,
          priceExclTax: selectedProduct.productPrice,
          total: selectedProduct.productPrice * 1,
        };

        setProductsWithQuantities((prev) => [...prev, newProductWithQuantity]);
      }
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

            {selectedSupplier && (
              <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold">Supplier Details</h3>
                <form>
                  <div className="flex gap-4">
                    <div className="mb-4 w-1/2">
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

                    <div className="mb-4 w-1/2">
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

                    <div className="mb-4 w-1/2">
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

                    <div className="mb-4 w-1/2">
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
              <div className="mt-8 max-h-96 overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                <h4 className="mb-4 text-lg font-semibold">Select Product</h4>
                <div className="space-y-4">
                  {productsWithQuantities.map((item, index) => (
                    <div
                      key={item.id}
                      className="mb-4 flex items-center justify-between gap-4"
                    >
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">
                          Product
                        </label>
                        <select
                          value={item.product.id}
                          onChange={(e) =>
                            handleSelectProductInLine(e.target.value, index)
                          }
                          className="w-full rounded-md border border-gray-300 p-2"
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

                      <div className="flex items-center gap-4">
                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>

                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Total
                          </label>
                          <input
                            type="text"
                            value={item.total}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                          />
                        </div>

                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            SKU
                          </label>
                          <input
                            type="text"
                            value={item.sku}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                          />
                        </div>

                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Product ID
                          </label>
                          <input
                            type="text"
                            value={item.id}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                          />
                        </div>

                        <div className="w-1/4">
                          <label className="block text-sm font-medium text-gray-700">
                            Price (Excl. Tax)
                          </label>
                          <input
                            type="text"
                            value={item.priceExclTax}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold">Total Amount</div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold">
                      {totalPayment.toFixed(2)} DT
                    </div>
                    <div className="w-1/4">
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Type
                      </label>
                      <select
                        value={selectedPaymentMode}
                        onChange={(e) => setSelectedPaymentMode(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="">Select Payment Type</option>
                        <option value="Credit">Credit</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button onClick={handleSubmit} className="neon-button">
                    Submit Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;

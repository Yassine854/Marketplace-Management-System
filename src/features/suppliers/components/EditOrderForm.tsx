import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Calendar } from "lucide-react";
import {
  PurchaseOrder,
  PurchaseOrderUpdate,
  PurchaseOrderStatus,
  Product,
  Supplier,
  Warehouse,
} from "./types/purchaseOrder";
import { updatePurchaseOrder } from "./services/puchaseService";
export default function EditOrderForm({
  order,
  onClose,
  onUpdate,
}: {
  order: PurchaseOrder;
  onClose: () => void;
  onUpdate: (updatedOrder: PurchaseOrder) => void;
}) {
  const [formData, setFormData] = useState<PurchaseOrderUpdate>({
    deliveryDate: new Date(order.deliveryDate),
    totalAmount: order.totalAmount || 0,
    status: order.status,
    supplierId: order.manufacturerId,
    warehouseId: order.warehouseId,
    products: order.products,
  });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>(
    {},
  );
  const [productRows, setProductRows] = useState([
    {
      productId: "",

      name: "",

      quantity: 0,

      sku: "",

      priceExclTax: 0,

      total: 0,
    },
  ]);

  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);

  const [comment, setComment] = useState(order.comment || "");
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>(
    order.files || [],
  );
  const [paymentTypes, setPaymentTypes] = useState(order.paymentTypes || []);
  const handlePaymentTypeChange = (index: number, type: string) => {
    const updatedPaymentTypes = [...paymentTypes];

    updatedPaymentTypes[index].type = type;

    setPaymentTypes(updatedPaymentTypes);
  };

  const totalAmount = formData.totalAmount || 0;

  const handlePaymentPercentageChange = (index: number, value: string) => {
    const newPercentage = Math.min(parseFloat(value) || 0, 100);

    const updatedPayments = [...paymentTypes];
    const totalAmount = formData.totalAmount || 0;

    updatedPayments[index] = {
      ...updatedPayments[index],

      percentage: newPercentage,

      amount: (totalAmount * newPercentage) / 100,
    };

    setPaymentTypes(updatedPayments);
  };

  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmount = Math.min(
      parseFloat(value) || 0,
      formData.totalAmount || 0,
    );
    const updatedPayments = [...paymentTypes];

    updatedPayments[index] = {
      ...updatedPayments[index],

      amount: newAmount,

      percentage: totalAmount !== 0 ? (newAmount / totalAmount) * 100 : 0,
    };

    setPaymentTypes(updatedPayments);
  };
  useEffect(() => {
    const newTotal = productRows.reduce((sum, row) => sum + row.total, 0);
    setFormData((prev) => ({
      ...prev,
      totalAmount: newTotal,
    }));
  }, [productRows]);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await fetch(`/api/purchaseOrder/${order.id}`);
        const data = await response.json();
        console.log("Fetched data:", data);
        console.log("hedha:", data);

        if (response.ok) {
          setFormData({
            deliveryDate: new Date(data.deliveryDate),
            totalAmount: data.totalAmount,
            status: data.status,
            supplierId: data.manufacturer.manufacturer_id,
            warehouseId: data.warehouse.warehouse_id,
            products: data.products,
          });
          setSelectedSupplier(data.manufacturer);
          console.log("id", data.manufacturer.manufacturerId);

          if (data.manufacturer.manufacturerId) {
            const supplierId = data.manufacturer.manufacturerId.toString();

            console.log("[Front] Supplier ID converti:", supplierId);

            const apiUrl = `/api/prod?supplierId=${encodeURIComponent(
              supplierId,
            )}`;

            console.log("[Front] Appel API:", apiUrl);

            const productsResponse = await fetch(apiUrl);

            if (!productsResponse.ok) {
              const errorData = await productsResponse.json();

              throw new Error(errorData.error || "Erreur API");
            }

            const productsData = await productsResponse.json();

            const mappedProducts = productsData.map((product: any) => ({
              ...product,
              priceExclTax: product.price,
            }));

            console.log("[Front] Produits reçus et mappés:", mappedProducts);

            setAvailableProducts(mappedProducts);
          }

          const initialProductRows = data.products.map((product: any) => ({
            productId: product.id,
            name: product.name,
            quantity: product.quantity,
            sku: product.sku,
            priceExclTax: product.priceExclTax,
            total: product.quantity * product.priceExclTax,
          }));
          setProductRows(initialProductRows);

          const initialQuantities = data.products.reduce(
            (
              acc: { [x: string]: any },
              product: { id: string | number; quantity: any },
            ) => {
              acc[product.id] = product.quantity;
              return acc;
            },
            {},
          );
          setQuantities(initialQuantities);

          setSelectedWarehouse(data.warehouse);
          setPaymentTypes(data.paymentTypes || []);
          setComment(data.comment || "");
          setFileList(data.files || []);
        } else {
          toast.error(data.error || "Failed to fetch purchase order");
        }
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        toast.error("Error fetching purchase order");
      }
    };

    fetchPurchaseOrder();
  }, [order.id]);
  const removeProduct = (productId: string) => {
    setProductRows((rows) => rows.filter((row) => row.productId !== productId));
  };
  const handleProductToggle = (
    e: React.ChangeEvent<HTMLInputElement>,
    product: Product,
  ) => {
    if (e.target.checked) {
      setProductRows([
        ...productRows,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          sku: product.sku,
          priceExclTax: product.priceExclTax,
          total: product.priceExclTax,
        },
      ]);
    } else {
      setProductRows(productRows.filter((row) => row.productId !== product.id));
    }
  };
  const updateQuantity = (index: number, quantity: number) => {
    const newRows = [...productRows];
    newRows[index] = {
      ...newRows[index],
      quantity,
      total: quantity * newRows[index].priceExclTax,
    };
    setProductRows(newRows);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedOrder = await updatePurchaseOrder(order.id, {
        ...formData,
        supplierId: selectedSupplier?.manufacturer_id || 0,
        warehouseId: selectedWarehouse?.warehouse_id || 0,
        products: productRows
          .filter((row) => row.productId && row.quantity > 0)
          .map((row) => {
            const product = availableProducts.find(
              (p) => p.id === row.productId,
            );
            return {
              id: row.productId,
              quantity: row.quantity,
              sku: row.sku,
              name: product?.name || "",
              priceExclTax: product?.priceExclTax || 0,
              total: row.total,
            };
          }),
        paymentTypes,
        comment,
        files: fileList,
      });
      onUpdate(updatedOrder);
      toast.success("Order successfully updated!");
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating the order.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Order
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Delivery Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Delivery Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.deliveryDate?.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryDate: new Date(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 pl-12 shadow-md focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Total Amount (DT)
            </label>
            <input
              type="number"
              value={formData.totalAmount}
              readOnly
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              value={formData.status}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-md"
            />
          </div>

          {/* Supplier Information */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              value={selectedSupplier?.companyName || ""}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-md"
            />
          </div>

          {/* Warehouse Information */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Warehouse
            </label>
            <input
              type="text"
              value={selectedWarehouse?.name || ""}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 shadow-md"
            />
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Gestion des Produits
            </label>

            {/* Produits Disponibles */}
            <div className="mb-8">
              <h3 className="mb-3 text-lg font-semibold">
                Produits du Fournisseur
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      productRows.some((r) => r.productId === product.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productRows.some(
                            (r) => r.productId === product.id,
                          )}
                          onChange={(e) => handleProductToggle(e, product)}
                          className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">
                          {product.priceExclTax.toFixed(2)} DT
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Produits Sélectionnés */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Produits Commandés</h3>
              <div className="space-y-4">
                {productRows.map((row, index) => {
                  const product = availableProducts.find(
                    (p) => p.id === row.productId,
                  );
                  return (
                    <div
                      key={index}
                      className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {row.name || "Produit inconnu"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(row.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Quantité
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) =>
                              updateQuantity(index, Number(e.target.value))
                            }
                            className="w-full rounded-md border p-2"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Prix Unitaire
                          </label>
                          <div className="rounded-md bg-gray-100 p-2">
                            {row.priceExclTax.toFixed(2)} DT
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Total
                          </label>
                          <div className="rounded-md bg-blue-50 p-2 font-medium text-blue-600">
                            {row.total.toFixed(2)} DT
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Général */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total de la Commande:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formData.totalAmount?.toFixed(2) || "0.00"} DT
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Total Amount (DT)
            </label>
            <input
              type="number"
              value={(formData.totalAmount || 0).toFixed(2)}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Methods
            </label>
            {paymentTypes.map((payment, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  value={payment.type}
                  readOnly
                  className="mt-1 block w-1/3 rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Type"
                />

                <input
                  type="number"
                  value={payment.percentage}
                  onChange={(e) =>
                    handlePaymentPercentageChange(index, e.target.value)
                  }
                  className="mt-1 block w-1/3 rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Percentage"
                />

                <input
                  type="number"
                  value={payment.amount}
                  onChange={(e) =>
                    handlePaymentAmountChange(index, e.target.value)
                  }
                  className="mt-1 block w-1/3 rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Amount"
                />
              </div>
            ))}
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                setFileList([
                  ...fileList,
                  { name: file.name, url: URL.createObjectURL(file) },
                ]);
              }
            }}
            className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
          />
          {fileList.map((file, index) => (
            <div key={index} className="mt-2 flex items-center justify-between">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file.name}
              </a>
              <button
                type="button"
                onClick={() => {
                  const newFileList = fileList.filter((_, i) => i !== index);
                  setFileList(newFileList);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-5 py-2 font-medium text-gray-800 transition hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

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
  const [selectedProductId, setSelectedProductId] = useState("");
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

  const [comment, setComment] = useState(order.comment || "");
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>(
    order.files || [],
  );

  const totalAmount = formData.totalAmount || 0;

  const [paymentTypes, setPaymentTypes] = useState<
    { type: string; percentage: string; amount: string }[]
  >(
    order.paymentTypes?.map((p) => ({
      type: p.type,

      percentage: p.percentage?.toString() || "",

      amount: p.amount?.toString() || "",
    })) || [{ type: "", percentage: "", amount: "" }],
  );

  const [remainingAmount, setRemainingAmount] = useState(0);
  useEffect(() => {
    const updatedPayments = paymentTypes.map((payment) => {
      if (payment.percentage) {
        const newAmount = (totalAmount * parseFloat(payment.percentage)) / 100;

        return {
          ...payment,

          amount: newAmount.toFixed(2),
        };
      }

      return payment;
    });

    setPaymentTypes(updatedPayments);
  }, [totalAmount]);

  useEffect(() => {
    const totalAllocated = paymentTypes.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),

      0,
    );

    setRemainingAmount(totalAmount - totalAllocated);
  }, [paymentTypes, totalAmount]);

  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmount = Math.min(parseFloat(value) || 0, totalAmount);

    const updatedPayments = [...paymentTypes];

    const newPercentage =
      totalAmount !== 0 ? (newAmount / totalAmount) * 100 : 0;

    updatedPayments[index] = {
      ...updatedPayments[index],

      amount: newAmount.toString(),

      percentage: newPercentage.toFixed(2),
    };

    const totalAllocated = updatedPayments.reduce(
      (acc, payment) => acc + (parseFloat(payment.amount || "0") || 0),

      0,
    );

    if (totalAllocated < totalAmount && index === updatedPayments.length - 1) {
      updatedPayments.push({ type: "", percentage: "", amount: "" });
    }

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
            const apiUrl = `/api/prod?supplierId=${encodeURIComponent(
              supplierId,
            )}`;
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

            setAvailableProducts(mappedProducts);
          }
          const initialPayments =
            data.paymentTypes?.length > 0
              ? [...data.paymentTypes, { type: "", percentage: "", amount: "" }]
              : [{ type: "", percentage: "", amount: "" }];

          setPaymentTypes(
            initialPayments.map((p) => ({
              type: p.type,

              percentage: p.percentage?.toString() || "",

              amount: p.amount?.toString() || "",
            })),
          );
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
      const convertedPaymentTypes = paymentTypes

        .filter((p) => p.type && p.amount)

        .map((p) => ({
          type: p.type,

          percentage: parseFloat(p.percentage),

          amount: parseFloat(p.amount),
        }));
      const updatedOrder = await updatePurchaseOrder(order.id, {
        ...formData,
        supplierId: selectedSupplier?.manufacturer_id || 0,
        warehouseId: selectedWarehouse?.warehouse_id || 0,

        products: productRows
          .filter((row) => row.productId && row.quantity > 0)

          .map((row) => ({
            id: row.productId,
            quantity: row.quantity,
            sku: row.sku,
            name: row?.name || "",
            priceExclTax: row?.priceExclTax || 0,
            total: row.total,
          })),
        paymentTypes: convertedPaymentTypes,
        comment,
        files: fileList,
      });
      onUpdate(updatedOrder);
      toast.success("Order successfully updated!");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating the order.");
    }
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

    if (totalAllocated < 100 && index === updatedPayments.length - 1) {
      updatedPayments.push({ type: "", percentage: "", amount: "" });
    }

    setPaymentTypes(updatedPayments);
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

          {/* Status */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as PurchaseOrderStatus,
                })
              }
              className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
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
            <div className="relative col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Supplier products
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedProductId(selectedId);

                  const selectedProduct = availableProducts.find(
                    (product) => product.id === selectedId,
                  );

                  if (selectedProduct) {
                    setProductRows((prevRows) => [
                      ...prevRows,
                      {
                        productId: selectedProduct.id,
                        name: selectedProduct.name,
                        quantity: 1,
                        sku: selectedProduct.sku,
                        priceExclTax: selectedProduct.priceExclTax,
                        total: selectedProduct.priceExclTax,
                      },
                    ]);
                    setSelectedProductId("");
                  }
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">select product</option>
                {availableProducts
                  .filter(
                    (product) =>
                      !productRows.some((row) => row.productId === product.id),
                  )
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.priceExclTax.toFixed(2)} DT
                    </option>
                  ))}
              </select>
            </div>

            {/* Produits Sélectionnés */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Products Ordered</h3>
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
                            Quantity
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
                            Unit Price
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
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Payment Methods
            </label>

            {/* En-têtes des colonnes */}
            <div className="mb-2 grid grid-cols-12 gap-4">
              <div className="col-span-3 text-sm font-medium text-gray-700">
                Type
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-700">
                Percentage
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-700">
                Amount
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-700">
                Remaining
              </div>
              <div className="col-span-1"></div>
            </div>

            {paymentTypes.map((payment, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-12 items-center gap-4"
              >
                {/* Sélecteur de type */}
                <select
                  className="col-span-3 rounded-lg border-gray-300 p-3 shadow-md"
                  value={payment.type}
                  onChange={(e) => {
                    const updated = [...paymentTypes];
                    updated[index].type = e.target.value;
                    setPaymentTypes(updated);
                  }}
                >
                  <option value="">Select method</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                  <option value="TRAITE">Traite</option>
                </select>

                {/* Pourcentage */}
                <input
                  type="number"
                  value={payment.percentage}
                  onChange={(e) =>
                    handlePaymentPercentageChange(index, e.target.value)
                  }
                  className="col-span-2 rounded-lg border-gray-300 p-3 shadow-md"
                  placeholder="%"
                  step="0.01"
                />

                {/* Montant */}
                <input
                  type="number"
                  value={payment.amount}
                  onChange={(e) =>
                    handlePaymentAmountChange(index, e.target.value)
                  }
                  className="col-span-3 rounded-lg border-gray-300 p-3 shadow-md"
                  placeholder="Amount"
                  step="0.01"
                />

                {/* Montant restant */}
                <div className="col-span-3">
                  <input
                    type="number"
                    value={remainingAmount.toFixed(2)}
                    disabled
                    className="w-full rounded-lg bg-gray-100 p-3"
                  />
                </div>

                {/* Bouton de suppression */}
                {index < paymentTypes.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentTypes((p) => p.filter((_, i) => i !== index))
                    }
                    className="col-span-1 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}

            {/* Totaux */}
            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="font-medium">Total Allocated:</span>
              <span>{(totalAmount - remainingAmount).toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Remaining Amount:</span>
              <span>{remainingAmount.toFixed(2)} DT</span>
            </div>
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

          <div className="relative w-full">
            <input
              type="file"
              id="fileInput"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setFileList([
                    ...fileList,
                    { name: file.name, url: URL.createObjectURL(file) },
                  ]);
                }
              }}
              className="hidden"
            />

            <label
              htmlFor="fileInput"
              className="mt-1 block w-full flex-grow cursor-pointer rounded-lg border-gray-300 bg-blue-600 p-3 text-center text-white shadow-md transition hover:bg-blue-700 focus:border-blue-500 focus:ring-blue-500"
            >
              Choose File
            </label>

            {fileList.map((file, index) => (
              <div
                key={index}
                className="mt-2 flex items-center justify-between"
              >
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

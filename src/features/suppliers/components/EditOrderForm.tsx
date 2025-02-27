import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Calendar } from "lucide-react";
import {
  PurchaseOrder,
  PurchaseOrderUpdate,
  PurchaseOrderStatus,
} from "./types/purchaseOrder";
import { updatePurchaseOrder } from "./services/puchaseService";
import { Supplier, Product, Warehouse } from "../new/types/types";

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
    totalAmount: order.totalAmount,
    status: order.status,
    supplierId: order.supplierId,
    warehouseId: order.warehouseId,
    products: order.products,
  });

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
  const [paymentTypes, setPaymentTypes] = useState(order.paymentTypes);
  const [comment, setComment] = useState(order.comment || "");
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>(
    order.files || [],
  );
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await fetch(`/api/purchaseOrder/${order.id}`);
        const data = await response.json();
        console.log("Fetched data:", data);

        if (response.ok) {
          setFormData({
            deliveryDate: new Date(data.deliveryDate),
            totalAmount: data.totalAmount,
            status: data.status,
            supplierId: data.supplierId,
            warehouseId: data.warehouseId,
            products: data.products,
          });
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
          setSelectedSupplier(data.manufacturer);
          setSelectedWarehouse(data.warehouse);
          setPaymentTypes(data.payments || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedOrder = await updatePurchaseOrder(order.id, {
        ...formData,
        supplierId: selectedSupplier
          ? String(selectedSupplier.manufacturer_id)
          : "",
        warehouseId: selectedWarehouse?.warehouse_id || "",
        products: Object.keys(quantities).map((productId) => {
          const product = (formData.products || []).find(
            (p) => p.id === productId,
          );
          return {
            id: productId,
            quantity: quantities[productId],
            name: product?.name || "",
            priceExclTax: product?.priceExclTax || 0,
            total: (quantities[productId] || 0) * (product?.priceExclTax || 0),
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
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" // Ajoutez max-h-[90vh] et overflow-y-auto
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

          {/* Products Selection */}
          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Products
            </label>
            {(formData.products || []).map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <input
                  type="number"
                  value={quantities[product.id] || 0}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.id]: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-1/4 rounded-lg border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500"
                />
                <span>{product.name}</span>
                <span>
                  {quantities[product.id] || 0} x{" "}
                  {product.priceExclTax.toFixed(2)} DT
                </span>

                <span>
                  {(
                    (quantities[product.id] || 0) * product.priceExclTax
                  ).toFixed(2)}{" "}
                  DT
                </span>
              </div>
            ))}
          </div>

          {/* Payment Types */}
          <div className="relative col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Methods
            </label>
            {(paymentTypes || []).map((payment, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span>{payment.type}</span>
                <span>{payment.percentage}%</span>
                <span>{payment.amount.toFixed(2)} DT</span>
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

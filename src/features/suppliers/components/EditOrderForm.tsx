import { useState } from "react";
import toast from "react-hot-toast";
import { X, Calendar, ClipboardCheck } from "lucide-react";
import {
  PurchaseOrder,
  PurchaseOrderUpdate,
  PurchaseOrderStatus,
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
    totalAmount: order.totalAmount,
    status: order.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedOrder = await updatePurchaseOrder(order.id, formData);
      onUpdate(updatedOrder);
      toast.success("Order successfully updated!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating the order.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
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

        <div className="space-y-5">
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

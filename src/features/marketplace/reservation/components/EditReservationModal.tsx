import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Reservation,
  ReservationItem,
} from "@/features/marketplace/reservation/types/reservation";

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (reservationData: {
    id: string;
    isActive?: boolean;
    shippingMethod?: string;
    shippingAmount?: number;
  }) => void;
  initialData: Reservation | null;
}

const EditReservationModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: EditReservationModalProps) => {
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingAmount, setShippingAmount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (initialData) {
      setShippingMethod(initialData.shippingMethod || "");
      setShippingAmount(initialData.shippingAmount || 0);
      setIsActive(initialData.isActive || false);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return;

    const reservationData = {
      id: initialData.id,
      shippingMethod: shippingMethod.trim() || undefined,
      shippingAmount: shippingAmount || undefined,
      isActive,
    };

    onEdit(reservationData);
    resetForm();
  };

  const resetForm = () => {
    setShippingMethod("");
    setShippingAmount(0);
    setIsActive(false);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Edit Reservation
        </h2>

        {/* Reservation Details */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Reservation Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reservation ID
              </label>
              <p className="mt-1 text-sm text-gray-900">{initialData.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.customer?.firstName}{" "}
                {initialData.customer?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Amount (TTC)
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.amountTTC.toFixed(2)} TND
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Created Date
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(initialData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.paymentMethod?.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.weight} kg
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Items */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Reservation Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Product
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    SKU
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Partner → Source
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialData.reservationItems.map((item: ReservationItem) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">
                      {item.product?.name || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{item.sku}</td>
                    <td className="px-3 py-2 text-gray-900">
                      {item.qteReserved}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {item.discountedPrice.toFixed(2)} TND
                    </td>

                    <td className="px-3 py-2 text-gray-600">
                      {/* Partner → Source Partner - Source Name */}
                      {`${item.partner?.username || "N/A"} → ${
                        item.source?.name || "N/A"
                      }`}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {(item.qteReserved * item.discountedPrice).toFixed(2)} TND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Form */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Edit Reservation Settings
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="shippingMethod"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Method
              </label>
              <input
                id="shippingMethod"
                type="text"
                placeholder="Enter shipping method"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="shippingAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Amount (TND)
              </label>
              <input
                id="shippingAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={shippingAmount}
                onChange={(e) =>
                  setShippingAmount(parseFloat(e.target.value) || 0)
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Active Reservation
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Active reservations can be processed and converted to orders
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;

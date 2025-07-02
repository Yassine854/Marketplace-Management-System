import { useState, useEffect, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Order,
  Status,
  State,
} from "@/features/marketplace/orders/types/order";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (orderData: {
    id: string;
    statusId?: string;
    stateId?: string;
  }) => void;
  initialData: Order | null;
  statuses?: Status[];
  states?: State[];
}

const EditOrderModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
  statuses: propStatuses,
  states: propStates,
}: EditOrderModalProps) => {
  const [statusId, setStatusId] = useState("");
  const [stateId, setStateId] = useState("");
  const [statuses, setStatuses] = useState<Status[]>(propStatuses || []);
  const [states, setStates] = useState<State[]>(propStates || []);

  useEffect(() => {
    if (initialData) {
      // Set stateId first
      const newStateId = initialData.stateId || initialData.state?.id || "";
      setStateId(newStateId);

      // Find statuses for this state
      const relatedStatuses = (statuses || []).filter(
        (s) => s.stateId === newStateId,
      );

      // Set statusId only if it exists in the related statuses
      const newStatusId = initialData.statusId || initialData.status?.id || "";
      if (relatedStatuses.some((s) => s.id === newStatusId)) {
        setStatusId(newStatusId);
      } else if (relatedStatuses.length > 0) {
        setStatusId(relatedStatuses[0].id); // Optionally select the first related status
      } else {
        setStatusId("");
      }
    }
    // eslint-disable-next-line
  }, [initialData, statuses]);

  useEffect(() => {
    if (!propStatuses) {
      fetch("/api/marketplace/status/getAll")
        .then((res) => res.json())
        .then((data) => setStatuses(data.statuses || []));
    }
    if (!propStates) {
      fetch("/api/marketplace/state/getAll")
        .then((res) => res.json())
        .then((data) => setStates(data.states || []));
    }
  }, [propStatuses, propStates]);

  // Filter statuses by selected stateId
  const filteredStatuses = useMemo(() => {
    if (!stateId) return [];
    return statuses.filter((status) => status.stateId === stateId);
  }, [statuses, stateId]);

  // If the current statusId is not in the filtered list, clear it
  useEffect(() => {
    if (statusId && !filteredStatuses.some((s) => s.id === statusId)) {
      setStatusId("");
    }
  }, [filteredStatuses, statusId]);

  const handleSubmit = () => {
    if (!initialData) return;
    const orderData = {
      id: initialData.id,
      statusId: statusId || undefined,
      stateId: stateId || undefined,
    };
    onEdit(orderData);
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

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Order Details</h2>

        {/* Order Details (Read-only) */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Order Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order ID
              </label>
              <p className="mt-1 text-sm text-gray-900">{initialData.id}</p>
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
                Customer
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.customer?.firstName}{" "}
                {initialData.customer?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.agent?.firstName} {initialData.agent?.lastName}
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
                Shipping Method
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.shippingMethod}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Amount
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.shippingAmount} TND
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
                From Mobile
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {initialData.fromMobile ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Order Items
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
                {initialData.orderItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">
                      {item.product?.name || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{item.sku}</td>
                    <td className="px-3 py-2 text-gray-900">
                      {item.qteOrdered}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {item.discountedPrice.toFixed(2)} TND
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {`${item.source.partner?.username || "N/A"} → ${
                        item.source?.name || "N/A"
                      }`}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {(item.qteOrdered * item.discountedPrice).toFixed(2)} TND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Form: Only State & Status */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Edit State & Status
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select status</option>
                {filteredStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
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

export default EditOrderModal;

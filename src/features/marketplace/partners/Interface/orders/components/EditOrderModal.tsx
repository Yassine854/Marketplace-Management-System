import { useState, useEffect, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Status,
  State,
  Partner,
  Customer,
} from "@/features/marketplace/partners/Interface/orders/types/order";
import { VendorOrder } from "../hooks/useGetAllOrders";
import { OrderStateFactory } from "@/features/marketplace/orders/state/OrderStateFactory";
import { OrderContext } from "@/features/marketplace/orders/state/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (orderData: {
    id: string;
    itemsSnapshot: any[];
    stateId: string;
    statusId: string;
  }) => void;
  initialData: VendorOrder | null;
  statuses?: Status[];
  states?: State[];
}

type EditableSnapshotItem = any;

const EditOrderModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
  statuses: propStatuses,
  states: propStates,
}: EditOrderModalProps) => {
  const [statuses, setStatuses] = useState<Status[]>(propStatuses || []);
  const [states, setStates] = useState<State[]>(propStates || []);
  const [itemsSnapshot, setItemsSnapshot] = useState<EditableSnapshotItem[]>(
    [],
  );
  const [stateId, setStateId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [itemsWithAmount, setItemsWithAmount] = useState<any[]>([]);
  const [orderContext, setOrderContext] = useState<OrderContext | null>(null);

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

  useEffect(() => {
    if (initialData) {
      const stateName = initialData.state?.name || "new";
      const context = new OrderContext(
        OrderStateFactory.createState(stateName),
        initialData.id,
      );
      setOrderContext(context);
      if (initialData?.itemsSnapshot) {
        const items = initialData.itemsSnapshot.map((item: any) => ({
          ...item,
          originalQteOrdered: item.qteOrdered,
          originalSealable: item.sealable,
          amount:
            (item.specialPrice ?? item.unitPrice ?? 0) * (item.qteOrdered || 1),
        }));
        setItemsWithAmount(items);
      }
      setStateId(initialData?.state?.id || "");
      setStatusId(initialData?.status?.id || "");
    }
  }, [initialData]);

  // Filter statuses by selected stateId
  const filteredStatuses = useMemo(() => {
    if (!stateId) return [];
    return statuses.filter((status) => status.stateId === stateId);
  }, [statuses, stateId]);

  // Handle state change (state pattern logic can be added here)
  const handleStateChange = async (newStateId: string) => {
    const newState = states.find((s) => s.id === newStateId);
    if (!newState || !orderContext) return;
    // Use the state pattern to check transition
    const canTransition = orderContext
      .getState()
      .canTransitionTo(newState.name);
    if (canTransition) {
      await orderContext.requestTransition(newState.name);
      setStateId(newStateId);
      // Optionally update the context's state
      orderContext.setState(OrderStateFactory.createState(newState.name));
    } else {
      // Optionally show a message: transition not allowed
    }
  };

  const handleStatusChange = (newStatusId: string) => {
    setStatusId(newStatusId);
  };

  // Handle quantity change and recalculate amount
  const handleSnapshotChange = (index: number, field: string, value: any) => {
    const newItems = [...itemsWithAmount];
    newItems[index][field] = value;
    if (field === "qteOrdered") {
      const price =
        newItems[index].specialPrice ?? newItems[index].unitPrice ?? 0;
      newItems[index].amount = price * value;
      // Update sealable
      const origQte =
        newItems[index].originalQteOrdered ?? newItems[index].qteOrdered ?? 0;
      const origSealable =
        newItems[index].originalSealable ?? newItems[index].sealable ?? 0;
      newItems[index].sealable = origSealable - (value - origQte);
    }
    setItemsWithAmount(newItems);
  };

  const handleSubmit = () => {
    if (!initialData) return;
    onEdit({
      id: initialData.id,
      itemsSnapshot: itemsWithAmount.map((item) => ({
        id: item.id,
        qteOrdered: item.qteOrdered,
        sealable: item.sealable,
        productId: item.productId,
        sourceId: item.sourceId,
      })),
      stateId,
      statusId,
    });
  };

  if (!isOpen || !initialData) return null;

  const customer =
    initialData.order && "customer" in initialData.order
      ? (initialData.order.customer as Customer)
      : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative my-8 w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">
                Order Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-200px)] space-y-8 overflow-y-auto p-6">
              {/* Order Details Section */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  Order Information
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block font-medium text-gray-700">
                      Order Code
                    </label>
                    <p className="text-gray-900">{initialData.orderCode}</p>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-700">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {new Date(initialData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-700">
                      Customer Name
                    </label>
                    <p className="text-gray-900">
                      {customer
                        ? `${customer.firstName ?? ""} ${
                            customer.lastName ?? ""
                          }`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-700">
                      Customer Telephone
                    </label>
                    <p className="text-gray-900">{customer?.telephone ?? ""}</p>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-gray-700">
                      Customer Address
                    </label>
                    <p className="text-gray-900">{customer?.address ?? ""}</p>
                  </div>
                </div>
              </div>

              {/* State & Status Section */}
              <div className="flex items-center gap-8 rounded-lg bg-gray-50 p-6">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Order State
                  </label>
                  <select
                    value={stateId}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="mt-1 block w-56 rounded-md border border-gray-300 px-2 py-2 text-lg"
                  >
                    <option value="">Select state</option>
                    {states
                      .filter(
                        (state) =>
                          state.id === stateId ||
                          !orderContext ||
                          orderContext.getState().canTransitionTo(state.name),
                      )
                      .map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Order Status
                  </label>
                  <select
                    value={statusId}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="mt-1 block w-56 rounded-md border border-gray-300 px-2 py-2 text-lg"
                    disabled={!stateId}
                  >
                    <option value="">Select status</option>
                    {filteredStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items Snapshot Section */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  Items Snapshot
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          SKU
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Product Name
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Source Name
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Quantity
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Sealable
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Unit Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {itemsWithAmount.map((item, idx) => {
                        const price = item.specialPrice ?? item.unitPrice ?? 0;
                        const amount = (item.qteOrdered || 1) * price;
                        return (
                          <tr key={item.id || idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">
                              {item.sku}
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              {item.productName || ""}
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              {item.sourceName || ""}
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              <input
                                type="number"
                                min={1}
                                value={item.qteOrdered || 1}
                                onChange={(e) =>
                                  handleSnapshotChange(
                                    idx,
                                    "qteOrdered",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-24 rounded border border-gray-300 px-2 py-2 text-lg"
                              />
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              {item.sealable ?? "N/A"}
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              {price.toFixed(2)} TND
                            </td>
                            <td className="px-3 py-2 font-semibold text-gray-900">
                              {amount.toFixed(2)} TND
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer - Sticky Bottom */}
            <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-2xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Update Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditOrderModal;

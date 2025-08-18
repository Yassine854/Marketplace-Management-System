"use client";
import { useState, useEffect, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGrowthBook } from "@growthbook/growthbook-react";
import {
  Status,
  State,
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
  const gb = useGrowthBook();
  const experiment = gb?.run({
    key: "edit-order-variant",
    variations: [0, 1], // 0: original, 1: new variant
  });
  const variant = experiment?.value ?? 0;

  const [statuses, setStatuses] = useState<Status[]>(propStatuses || []);
  const [states, setStates] = useState<State[]>(propStates || []);
  const [itemsSnapshot, setItemsSnapshot] = useState<EditableSnapshotItem[]>(
    [],
  );
  const [stateId, setStateId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [itemsWithAmount, setItemsWithAmount] = useState<any[]>([]);
  const [orderContext, setOrderContext] = useState<OrderContext | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Track experiment exposure
  useEffect(() => {
    if (isOpen && initialData) {
      logExperimentGoal("modal_viewed");
    }
  }, [isOpen, initialData]);

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

  const filteredStatuses = useMemo(() => {
    if (!stateId) return [];
    return statuses.filter((status) => status.stateId === stateId);
  }, [statuses, stateId]);

  const handleStateChange = async (newStateId: string) => {
    const newState = states.find((s) => s.id === newStateId);
    if (!newState || !orderContext) return;

    const canTransition = orderContext
      .getState()
      .canTransitionTo(newState.name);
    if (canTransition) {
      await orderContext.requestTransition(newState.name);
      setStateId(newStateId);
      orderContext.setState(OrderStateFactory.createState(newState.name));
      logExperimentGoal("state_changed");
    }
  };

  const handleStatusChange = (newStatusId: string) => {
    setStatusId(newStatusId);
    logExperimentGoal("status_changed");
  };

  const handleSnapshotChange = (index: number, field: string, value: any) => {
    const newItems = [...itemsWithAmount];
    newItems[index][field] = value;
    if (field === "qteOrdered") {
      const price =
        newItems[index].specialPrice ?? newItems[index].unitPrice ?? 0;
      newItems[index].amount = price * value;
      const origQte =
        newItems[index].originalQteOrdered ?? newItems[index].qteOrdered ?? 0;
      const origSealable =
        newItems[index].originalSealable ?? newItems[index].sealable ?? 0;
      newItems[index].sealable = origSealable - (value - origQte);
    }
    setItemsWithAmount(newItems);
    setInteractionCount((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (!initialData) return;
    setHasSubmitted(true);
    logExperimentGoal("order_updated");
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

  const logExperimentGoal = async (goalName: string) => {
    try {
      await fetch("/api/marketplace/experimentLogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: "edit-order-variant",
          variationId: variant,
          goalName,
        }),
      });
    } catch (error) {
      console.error("Error logging experiment goal:", error);
    }
  };

  if (!isOpen || !initialData) return null;

  const customer =
    initialData.order && "customer" in initialData.order
      ? (initialData.order.customer as Customer)
      : undefined;

  // Calculate total amount
  const totalAmount = itemsWithAmount.reduce((sum, item) => {
    const price = item.specialPrice ?? item.unitPrice ?? 0;
    return sum + price * (item.qteOrdered || 1);
  }, 0);

  // Variant 1 - Modern split-layout design with blue theme
  if (variant === 1) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-blue-900 bg-opacity-40 backdrop-blur-sm"
            onClick={onClose}
            style={{ backgroundColor: "rgba(24, 59, 124, 0.4)" }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-7xl bg-gradient-to-br from-slate-50 to-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Header with Blue Theme */}
              <div
                className="px-8 py-6"
                style={{ backgroundColor: "rgb(24, 59, 124)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h1 className="text-3xl font-bold">Order Editor</h1>
                    <p className="mt-1 text-blue-100">
                      #{initialData.orderCode}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white bg-opacity-20 p-2 text-white transition-all hover:scale-110 hover:bg-opacity-30"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex h-[calc(100vh-120px)]">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="space-y-8">
                    {/* Customer Profile Card */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl"
                    >
                      <div
                        className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-opacity group-hover:opacity-10"
                        style={{ backgroundColor: "rgb(24, 59, 124)" }}
                      ></div>
                      <div className="relative">
                        <div className="mb-6 flex items-center gap-4">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{ backgroundColor: "rgb(24, 59, 124)" }}
                          >
                            <span className="text-lg font-bold text-white">
                              {customer?.firstName?.charAt(0) || "N"}
                            </span>
                          </div>
                          <div>
                            <h3
                              className="text-xl font-bold"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              Customer Details
                            </h3>
                            <p className="text-blue-600">
                              Order recipient information
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                              Full Name
                            </label>
                            <p
                              className="text-lg font-medium"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              {customer
                                ? `${customer.firstName ?? ""} ${
                                    customer.lastName ?? ""
                                  }`.trim() || "N/A"
                                : "N/A"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                              Phone
                            </label>
                            <p
                              className="text-lg font-medium"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              {customer?.telephone ?? "N/A"}
                            </p>
                          </div>
                          <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                              Address
                            </label>
                            <p
                              className="text-lg font-medium"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              {customer?.address ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Order Status Controls */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >
                      {/* State Selection */}
                      <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl">
                        <div
                          className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-opacity group-hover:opacity-10"
                          style={{ backgroundColor: "rgb(24, 59, 124)" }}
                        ></div>
                        <div className="relative">
                          <div className="mb-4">
                            <h3
                              className="text-xl font-bold"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              Order State
                            </h3>
                            <p className="text-blue-600">
                              Current processing stage
                            </p>
                          </div>
                          <select
                            value={stateId}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-4 text-lg font-medium transition-all focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20"
                            style={
                              {
                                color: "rgb(24, 59, 124)",
                              } as React.CSSProperties
                            }
                          >
                            <option value="">Select state</option>
                            {states
                              .filter(
                                (state) =>
                                  state.id === stateId ||
                                  !orderContext ||
                                  orderContext
                                    .getState()
                                    .canTransitionTo(state.name),
                              )
                              .map((state) => (
                                <option key={state.id} value={state.id}>
                                  {state.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      {/* Status Selection */}
                      <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl">
                        <div
                          className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-opacity group-hover:opacity-10"
                          style={{ backgroundColor: "rgb(24, 59, 124)" }}
                        ></div>
                        <div className="relative">
                          <div className="mb-4">
                            <h3
                              className="text-xl font-bold"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              Order Status
                            </h3>
                            <p className="text-blue-600">
                              Detailed status information
                            </p>
                          </div>
                          <select
                            value={statusId}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-4 text-lg font-medium transition-all focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 disabled:opacity-50"
                            style={
                              {
                                color: "rgb(24, 59, 124)",
                              } as React.CSSProperties
                            }
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
                    </motion.div>

                    {/* Order Items */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4">
                        <h3
                          className="text-2xl font-bold"
                          style={{ color: "rgb(24, 59, 124)" }}
                        >
                          Order Items
                        </h3>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                          {itemsWithAmount.length} items
                        </span>
                      </div>

                      <div className="grid gap-6">
                        {itemsWithAmount.map((item, idx) => {
                          const price =
                            item.specialPrice ?? item.unitPrice ?? 0;
                          const amount = (item.qteOrdered || 1) * price;
                          return (
                            <motion.div
                              key={item.id || idx}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 + idx * 0.1 }}
                              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-blue-100 transition-all duration-300 hover:shadow-lg"
                            >
                              <div
                                className="absolute right-0 top-0 h-full w-2 opacity-0 transition-opacity group-hover:opacity-100"
                                style={{ backgroundColor: "rgb(24, 59, 124)" }}
                              ></div>

                              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                                {/* Product Info */}
                                <div className="lg:col-span-2">
                                  <div className="flex items-start gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                                      <span className="text-2xl font-bold text-blue-700">
                                        {item.productName?.charAt(0) ||
                                          item.sku?.charAt(0) ||
                                          "P"}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h4
                                        className="text-lg font-bold"
                                        style={{ color: "rgb(24, 59, 124)" }}
                                      >
                                        {item.productName || item.sku}
                                      </h4>
                                      <p className="text-blue-600">
                                        {item.sourceName || "No source"}
                                      </p>
                                      <div className="mt-2 flex items-center gap-4 text-sm text-blue-700">
                                        <span className="font-semibold">
                                          {price.toFixed(2)} TND
                                        </span>
                                        <span>•</span>
                                        <span>
                                          Sealable: {item.sealable ?? "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                                    Quantity
                                  </label>
                                  <div className="relative">
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
                                      className="w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-center text-lg font-semibold transition-all focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20"
                                      style={
                                        {
                                          color: "rgb(24, 59, 124)",
                                        } as React.CSSProperties
                                      }
                                    />
                                  </div>
                                </div>

                                {/* Amount Display */}
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                                    Total
                                  </label>
                                  <div className="rounded-xl bg-blue-100 px-4 py-3 text-center">
                                    <span
                                      className="text-2xl font-bold"
                                      style={{ color: "rgb(24, 59, 124)" }}
                                    >
                                      {amount.toFixed(2)}
                                    </span>
                                    <span className="ml-1 text-blue-700">
                                      TND
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Sidebar - Order Summary */}
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                  }}
                  className="w-80 border-l border-blue-200 bg-gradient-to-b from-white to-blue-50 p-8"
                >
                  <div className="sticky top-0 space-y-8">
                    {/* Order Summary */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-blue-100">
                      <h3
                        className="mb-4 text-xl font-bold"
                        style={{ color: "rgb(24, 59, 124)" }}
                      >
                        Order Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-blue-700">
                          <span>Items Count:</span>
                          <span className="font-semibold">
                            {itemsWithAmount.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-blue-700">
                          <span>Created:</span>
                          <span className="font-semibold">
                            {new Date(
                              initialData.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-4">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-lg font-bold"
                              style={{ color: "rgb(24, 59, 124)" }}
                            >
                              Total Amount:
                            </span>
                            <div className="text-right">
                              <span
                                className="text-2xl font-bold"
                                style={{ color: "rgb(24, 59, 124)" }}
                              >
                                {totalAmount.toFixed(2)}
                              </span>
                              <span className="ml-1 text-blue-700">TND</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button
                        onClick={handleSubmit}
                        className="w-full rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={
                          {
                            backgroundColor: "rgb(24, 59, 124)",
                          } as React.CSSProperties
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgb(20, 50, 110)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgb(24, 59, 124)";
                        }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full rounded-2xl border-2 bg-white px-6 py-4 text-lg font-semibold transition-all duration-300 hover:bg-blue-50"
                        style={{
                          borderColor: "rgb(24, 59, 124)",
                          color: "rgb(24, 59, 124)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Progress Indicator */}
                    {interactionCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-2xl border border-blue-200 bg-blue-50 p-4"
                      >
                        <div className="text-center">
                          <span className="text-sm font-semibold text-blue-700">
                            {interactionCount} changes made
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Variant 0 - Original layout (unchanged)
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

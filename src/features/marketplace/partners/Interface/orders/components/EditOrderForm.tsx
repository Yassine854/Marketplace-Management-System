"use client";
import { useState, useEffect } from "react";
import { OrderWithRelations, OrderItemWithRelations } from "../types/order";
import {
  Status,
  State,
  Customers,
  Agent,
  Partner,
  OrderPayment,
} from "@prisma/client";
import ModalOrderItems from "../Modal/EditOrderItems";
import {
  XCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon,
  ArrowPathIcon,
  CalculatorIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  StarIcon,
  TruckIcon,
  CreditCardIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon,
  UserCircleIcon,
  IdentificationIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface AmountField {
  label: string;
  value: number;
  setter: (value: number) => void;
  icon: any;
}

const EditOrderForm = ({
  order,
  onClose,
  onUpdate,
}: {
  order: OrderWithRelations;
  onClose: () => void;
  onUpdate: (updatedOrder: OrderWithRelations) => void;
}) => {
  const [amountTTC, setAmountTTC] = useState(order.amountTTC);
  const [amountRefunded, setAmountRefunded] = useState(order.amountRefunded);
  const [amountOrdered, setAmountOrdered] = useState(order.amountOrdered);
  const [amountShipped, setAmountShipped] = useState(order.amountShipped);
  const [amountCanceled, setAmountCanceled] = useState(order.amountCanceled);
  const [shippingAmount, setShippingAmount] = useState(
    order.shippingAmount || 0,
  );
  const [loyaltyPtsValue, setLoyaltyPtsValue] = useState(order.loyaltyPtsValue);
  const [shippingMethod, setShippingMethod] = useState(
    order.shippingMethod || "",
  );
  const [weight, setWeight] = useState(order.weight || 0);
  const [fromMobile, setFromMobile] = useState(order.fromMobile || false);
  const [isActive, setIsActive] = useState(order.isActive);
  const [stateId, setStateId] = useState(order.state?.id || "");
  const [statusId, setStatusId] = useState(order.status?.id || "");
  const [customerId, setCustomerId] = useState(order.customer?.id || "");
  const [agentId, setAgentId] = useState(order.agent?.id || "");
  const [paymentMethodId, setPaymentMethodId] = useState(
    order.paymentMethod?.id || "",
  );
  const [orderItems, setOrderItems] = useState<OrderItemWithRelations[]>(
    order.orderItems || [],
  );
  const [error, setError] = useState("");
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);

  const amountFields: AmountField[] = [
    {
      label: "Amount TTC",
      value: amountTTC,
      setter: setAmountTTC,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Refunded",
      value: amountRefunded,
      setter: setAmountRefunded,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Ordered",
      value: amountOrdered,
      setter: setAmountOrdered,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Shipped",
      value: amountShipped,
      setter: setAmountShipped,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Canceled",
      value: amountCanceled,
      setter: setAmountCanceled,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Shipping Amount",
      value: shippingAmount,
      setter: setShippingAmount,
      icon: TruckIcon,
    },
    {
      label: "Loyalty Points Value",
      value: loyaltyPtsValue,
      setter: setLoyaltyPtsValue,
      icon: StarIcon,
    },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/api/marketplace/state/getAll",
            name: "states",
            filterFn: (item: State) => item.id && item.name,
          },
          {
            url: "/api/marketplace/status/getAll",
            name: "statuses",
            filterFn: (item: Status) => item.id && item.name,
          },
          {
            url: "/api/marketplace/customers/getAll",
            name: "customers",
            filterFn: (item: Customers) =>
              item.id && item.firstName && item.lastName,
          },
          {
            url: "/api/marketplace/agents/getAll",
            name: "agents",
            filterFn: (item: Agent) =>
              item.id && item.firstName && item.lastName,
          },
          {
            url: "/api/marketplace/payment_method/getAll",
            name: "paymentMethods",
            filterFn: (item: OrderPayment) => item.id && item.name,
            responseKey: "paymentMethods",
          },
        ];

        const results = await Promise.allSettled(
          endpoints.map((endpoint) =>
            fetch(endpoint.url).then((res) => res.json()),
          ),
        );

        results.forEach((result, index) => {
          const endpoint = endpoints[index];

          if (result.status === "fulfilled") {
            try {
              const responseData = result.value;
              let dataArray =
                responseData[endpoint.name] ||
                responseData.data ||
                responseData;
              if (Array.isArray(dataArray)) {
                const filteredData = dataArray.filter(endpoint.filterFn);

                switch (endpoint.name) {
                  case "states":
                    setStates(filteredData);
                    break;
                  case "statuses":
                    setStatuses(filteredData);
                    break;
                  case "customers":
                    setCustomers(filteredData);
                    break;
                  case "agents":
                    setAgents(filteredData);
                    break;
                  case "paymentMethods":
                    setPaymentMethods(filteredData);
                    break;
                }
              }
            } catch (parseError) {
              console.error(`Error processing ${endpoint.name}:`, parseError);
            }
          } else {
            console.error(`Failed to fetch ${endpoint.name}:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Error in fetchOptions:", error);
        setError("Failed to load form data. Please try again.");
        toast.error("Failed to load form options", {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    };

    fetchOptions();
  }, []);

  const validateAmounts = (): boolean => {
    const amounts = [
      amountTTC,
      amountRefunded,
      amountCanceled,
      amountOrdered,
      amountShipped,
      shippingAmount,
      loyaltyPtsValue,
    ];
    return amounts.every((amount) => amount >= 0);
  };

  const handleUpdateOrderItems = (updatedItems: OrderItemWithRelations[]) => {
    setOrderItems(updatedItems);
    setShowOrderItemsModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAmounts()) {
      setError("All amounts must be non-negative numbers");
      return;
    }

    setIsLoading(true);
    try {
      const updatedOrder: OrderWithRelations = {
        ...order,
        amountTTC,
        amountRefunded,
        amountOrdered,
        amountShipped,
        amountCanceled,
        shippingAmount,
        loyaltyPtsValue,
        shippingMethod,
        weight,
        fromMobile,
        isActive,
        stateId,
        statusId,
        customerId,
        agentId: agentId || null,
        paymentMethodId,
        orderItems,
        updatedAt: new Date(),
        state: states.find((s) => s.id === stateId) || null,
        status: statuses.find((s) => s.id === statusId) || null,
        customer: customers.find((c) => c.id === customerId) || null,
        agent: agents.find((a) => a.id === agentId) || null,
        paymentMethod:
          paymentMethods.find((p) => p.id === paymentMethodId) || null,
      };

      onUpdate(updatedOrder);
      onClose();
    } catch (error) {
      setError("An error occurred while updating the order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrderItems = () => {
    setShowOrderItemsModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Order Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center">
                <XCircleIcon className="mr-2 h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
              <CalculatorIcon className="mr-2 h-5 w-5" />
              Amounts
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {amountFields.map(({ label, value, setter, icon: Icon }) => (
                <div className="space-y-1" key={label}>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Icon className="mr-1 h-4 w-4" />
                    {label}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const numValue = Number(e.target.value);
                      if (numValue >= 0) setter(numValue);
                    }}
                    min="0"
                    step={label.includes("Amount") ? "0.01" : "1"}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                <ClipboardDocumentIcon className="mr-2 h-5 w-5" />
                Order Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <CheckBadgeIcon className="mr-1 h-4 w-4" />
                    State
                  </label>
                  <select
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <CheckBadgeIcon className="mr-1 h-4 w-4" />
                    Status
                  </label>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <TruckIcon className="mr-1 h-4 w-4" />
                    Shipping Method
                  </label>
                  <input
                    type="text"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <CreditCardIcon className="mr-1 h-4 w-4" />
                    Payment Method
                  </label>
                  <select
                    value={paymentMethodId}
                    onChange={(e) => setPaymentMethodId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ScaleIcon className="mr-1 h-4 w-4" />
                    Weight
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <DevicePhoneMobileIcon className="mr-1 h-4 w-4" />
                    From Mobile
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={fromMobile}
                      onChange={(e) => setFromMobile(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <ShieldCheckIcon className="mr-1 h-4 w-4" />
                    Active Order
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                <UserCircleIcon className="mr-2 h-5 w-5" />
                Associations
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <UserCircleIcon className="mr-1 h-4 w-4" />
                    Customer
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <IdentificationIcon className="mr-1 h-4 w-4" />
                    Agent
                  </label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEditOrderItems}
            className="flex w-full transform items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition-colors duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Order Items
          </button>
        </div>

        <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Update Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {showOrderItemsModal && (
        <ModalOrderItems
          isOpen={showOrderItemsModal}
          orderItems={order.orderItems || []}
          onClose={() => setShowOrderItemsModal(false)}
          onUpdate={handleUpdateOrderItems}
        />
      )}
    </div>
  );
};

export default EditOrderForm;

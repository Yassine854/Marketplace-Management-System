import { useState, useEffect } from "react";
import { OrderWithRelations, OrderItemWithRelations } from "../types/order";
import {
  Status,
  State,
  Customer,
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
} from "@heroicons/react/24/outline";

interface AmountField {
  label: string;
  field: keyof OrderWithRelations;
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
  const [updatedOrder, setUpdatedOrder] = useState<OrderWithRelations>(order);
  const [error, setError] = useState("");
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);
  const amountFields: AmountField[] = [
    {
      label: "Amount Excl. Tax",
      field: "amountExclTaxe",
      icon: CurrencyDollarIcon,
    },
    { label: "Amount TTC", field: "amountTTC", icon: CurrencyDollarIcon },
    {
      label: "Amount Before Promo",
      field: "amountBeforePromo",
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount After Promo",
      field: "amountAfterPromo",
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Refunded",
      field: "amountRefunded",
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Ordered",
      field: "amountOrdered",
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Shipped",
      field: "amountShipped",
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Canceled",
      field: "amountCanceled",
      icon: CurrencyDollarIcon,
    },
    { label: "Loyalty Points Value", field: "loyaltyPtsValue", icon: StarIcon },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          stateData,
          statusData,
          customerData,
          agentData,
          partnerData,
          paymentMethodData,
        ] = await Promise.all([
          fetch("/api/marketplace/state/getAll").then((res) => res.json()),
          fetch("/api/marketplace/status/getAll").then((res) => res.json()),
          fetch("/api/marketplace/customers/getAll").then((res) => res.json()),
          fetch("/api/marketplace/agents/getAll").then((res) => res.json()),
          fetch("/api/marketplace/partners/getAll").then((res) => res.json()),
          fetch("/api/marketplace/payment_method/getAll").then((res) =>
            res.json(),
          ),
        ]);

        const validPaymentMethods =
          paymentMethodData?.orderPayments?.filter(
            (method: OrderPayment) => method.id && method.name,
          ) || [];
        setPaymentMethods(validPaymentMethods);

        setStates(
          (stateData?.states || stateData).filter(
            (state: State) => state.id && state.name,
          ),
        );
        setStatuses(
          (statusData?.statuses || statusData).filter(
            (status: Status) => status.id && status.name,
          ),
        );
        setCustomers(
          (customerData?.customers || customerData).filter(
            (customer: Customer) =>
              customer.id && customer.firstName && customer.lastName,
          ),
        );
        setAgents(
          (agentData?.agents || agentData).filter(
            (agent: Agent) => agent.id && agent.firstName && agent.lastName,
          ),
        );
        setPartners(
          (partnerData?.partners || []).filter(
            (partner: Partner) =>
              partner.id && partner.firstName && partner.lastName,
          ),
        );
      } catch (error) {
        setError("Failed to fetch data");
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (paymentMethods.length > 0 && order.paymentMethodId) {
      const initialPaymentMethod = paymentMethods.find(
        (m) => m.id === order.paymentMethodId,
      );
      setUpdatedOrder((prev) => ({
        ...prev,
        paymentMethod: initialPaymentMethod || null,
        paymentMethodId: order.paymentMethodId || "",
      }));
    }
  }, [order.paymentMethodId, paymentMethods]);

  const validateAmounts = (order: OrderWithRelations): boolean => {
    const amounts = [
      order.amountExclTaxe,
      order.amountTTC,
      order.amountBeforePromo,
      order.amountAfterPromo,
      order.amountRefunded,
      order.amountCanceled,
      order.amountOrdered,
      order.amountShipped,
      order.loyaltyPtsValue,
    ];
    return amounts.every((amount) => amount >= 0);
  };

  const handleChange = (field: keyof OrderWithRelations, value: any) => {
    setUpdatedOrder((prev) => {
      if (field === "paymentMethodId") {
        const selectedPaymentMethod = paymentMethods.find(
          (m) => m.id === value,
        );
        return {
          ...prev,
          paymentMethod: selectedPaymentMethod || null,
          paymentMethodId: value,
        };
      }

      if (["status", "state", "customer", "agent", "partner"].includes(field)) {
        return { ...prev, [field]: { id: value } };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleAmountChange = (
    field: keyof OrderWithRelations,
    value: string,
  ) => {
    const numValue = Number(value);
    if (numValue < 0) {
      setError(`${field.toString()} must be non-negative`);
      return;
    }
    setError("");
    handleChange(field, numValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAmounts(updatedOrder)) {
      setError("All amounts must be non-negative numbers");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate({ ...updatedOrder, updatedAt: new Date() });
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
              {amountFields.map(({ label, field, icon: Icon }) => (
                <div className="space-y-1" key={field}>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Icon className="mr-1 h-4 w-4" />

                    {label}
                  </label>

                  <input
                    type="number"
                    value={Number(updatedOrder[field]) || 0}
                    onChange={(e) => handleAmountChange(field, e.target.value)}
                    min="0"
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
                {[
                  {
                    label: "State",
                    field: "state" as const,
                    icon: CheckBadgeIcon,
                    options: states,
                  },
                  {
                    label: "Status",
                    field: "status" as const,
                    icon: CheckBadgeIcon,
                    options: statuses,
                  },
                ].map(({ label, field, icon: Icon, options }) => (
                  <div className="space-y-1" key={field}>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Icon className="mr-1 h-4 w-4" />
                      {label}
                    </label>
                    <select
                      value={updatedOrder[field]?.id || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select {label}</option>
                      {options.map((option: any) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <TruckIcon className="mr-1 h-4 w-4" />
                    Shipping Method
                  </label>
                  <input
                    type="text"
                    value={updatedOrder.shippingMethod || ""}
                    onChange={(e) =>
                      handleChange(
                        "shippingMethod" as keyof OrderWithRelations,
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <CreditCardIcon className="mr-1 h-4 w-4" />
                    Payment Method
                  </label>
                  <select
                    value={updatedOrder.paymentMethodId || ""}
                    onChange={(e) =>
                      handleChange(
                        "paymentMethodId" as keyof OrderWithRelations,
                        e.target.value,
                      )
                    }
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
                    value={updatedOrder.weight || 0}
                    onChange={(e) =>
                      handleChange(
                        "weight" as keyof OrderWithRelations,
                        Number(e.target.value),
                      )
                    }
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
                      checked={updatedOrder.fromMobile || false}
                      onChange={(e) =>
                        handleChange(
                          "fromMobile" as keyof OrderWithRelations,
                          e.target.checked,
                        )
                      }
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
                {[
                  {
                    label: "Customer",
                    field: "customer" as const,
                    icon: UserCircleIcon,
                    options: customers,
                  },
                  {
                    label: "Agent",
                    field: "agent" as const,
                    icon: IdentificationIcon,
                    options: agents,
                  },
                  {
                    label: "Partner",
                    field: "partner" as const,
                    icon: HandRaisedIcon,
                    options: partners,
                  },
                ].map(({ label, field, icon: Icon, options }) => (
                  <div className="space-y-1" key={field}>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Icon className="mr-1 h-4 w-4" />
                      {label}
                    </label>
                    <select
                      value={updatedOrder[field]?.id || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select {label}</option>
                      {options.map((option: any) => (
                        <option key={option.id} value={option.id}>
                          {option.firstName} {option.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEditOrderItems}
            className="flex w-full transform items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition-colors duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <PencilSquareIcon className="h-5 w-5" />
                Edit Order Items
              </>
            )}
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
          orderItems={updatedOrder.orderItems || []}
          onClose={() => setShowOrderItemsModal(false)}
          onUpdate={(updatedItems: OrderItemWithRelations[]) => {
            setUpdatedOrder((prev) => ({
              ...prev,
              orderItems: updatedItems,
            }));
            setShowOrderItemsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EditOrderForm;

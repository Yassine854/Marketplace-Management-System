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
} from "@heroicons/react/24/outline";

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
  const [amountExclTaxe, setAmountExclTaxe] = useState(order.amountExclTaxe);
  const [amountTTC, setAmountTTC] = useState(order.amountTTC);
  const [amountBeforePromo, setAmountBeforePromo] = useState(
    order.amountBeforePromo,
  );
  const [amountAfterPromo, setAmountAfterPromo] = useState(
    order.amountAfterPromo,
  );
  const [amountRefunded, setAmountRefunded] = useState(order.amountRefunded);
  const [amountOrdered, setAmountOrdered] = useState(order.amountOrdered);
  const [amountShipped, setAmountShipped] = useState(order.amountShipped);
  const [amountCanceled, setAmountCanceled] = useState(order.amountCanceled);
  const [loyaltyPtsValue, setLoyaltyPtsValue] = useState(order.loyaltyPtsValue);
  const [shippingMethod, setShippingMethod] = useState(
    order.shippingMethod || "",
  );
  const [weight, setWeight] = useState(order.weight || 0);
  const [fromMobile, setFromMobile] = useState(order.fromMobile || false);
  const [stateId, setStateId] = useState(order.state?.id || "");
  const [statusId, setStatusId] = useState(order.status?.id || "");
  const [customerId, setCustomerId] = useState(order.customer?.id || "");
  const [agentId, setAgentId] = useState(order.agent?.id || "");
  const [partnerId, setPartnerId] = useState(order.partner?.id || "");
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
  const [partners, setPartners] = useState<Partner[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);

  const amountFields: AmountField[] = [
    {
      label: "Amount Excl. Tax",
      value: amountExclTaxe,
      setter: setAmountExclTaxe,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount TTC",
      value: amountTTC,
      setter: setAmountTTC,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount Before Promo",
      value: amountBeforePromo,
      setter: setAmountBeforePromo,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Amount After Promo",
      value: amountAfterPromo,
      setter: setAmountAfterPromo,
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
      label: "Loyalty Points Value",
      value: loyaltyPtsValue,
      setter: setLoyaltyPtsValue,
      icon: StarIcon,
    },
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
            (customer: Customers) =>
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

  const validateAmounts = (): boolean => {
    const amounts = [
      amountExclTaxe,
      amountTTC,
      amountBeforePromo,
      amountAfterPromo,
      amountRefunded,
      amountCanceled,
      amountOrdered,
      amountShipped,
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
        amountExclTaxe,
        amountTTC,
        amountBeforePromo,
        amountAfterPromo,
        amountRefunded,
        amountOrdered,
        amountShipped,
        amountCanceled,
        loyaltyPtsValue,
        shippingMethod,
        weight,
        fromMobile,
        stateId,
        statusId,
        customerId,
        agentId,
        partnerId,
        paymentMethodId,
        orderItems,
        updatedAt: new Date(),
        state: states.find((s) => s.id === stateId) || null,
        status: statuses.find((s) => s.id === statusId) || null,
        customer: customers.find((c) => c.id === customerId) || null,
        agent: agents.find((a) => a.id === agentId) || null,
        partner: partners.find((p) => p.id === partnerId) || null,
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

                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <HandRaisedIcon className="mr-1 h-4 w-4" />
                    Partner
                  </label>
                  <select
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Partner</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.firstName} {partner.lastName}
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

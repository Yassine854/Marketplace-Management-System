import { useState, useEffect } from "react";
import { OrderWithRelations, OrderItemWithRelations } from "../types/order";
import { Status, State, Customer, Agent, Partner } from "@prisma/client";
import ModalOrderItems from "../Modal/EditOrderItems";

const EditOrderForm = ({
  order,
  onClose,
  onUpdate,
}: {
  order: OrderWithRelations;
  onClose: () => void;
  onUpdate: (updatedOrder: OrderWithRelations) => void;
}) => {
  const [updatedOrder, setUpdatedOrder] = useState<OrderWithRelations>({
    ...order,
  });
  const [error, setError] = useState("");
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const stateData = await fetch("/api/marketplace/state/getAll").then(
          (res) => res.json(),
        );
        const statusData = await fetch("/api/marketplace/status/getAll").then(
          (res) => res.json(),
        );
        const customerData = await fetch(
          "/api/marketplace/customers/getAll",
        ).then((res) => res.json());
        const agentData = await fetch("/api/marketplace/agents/getAll").then(
          (res) => res.json(),
        );
        const partnerData = await fetch(
          "/api/marketplace/partners/getAll",
        ).then((res) => res.json());

        if (Array.isArray(stateData)) {
          setStates(
            stateData.filter(
              (state: State) => state.id != null && state.name != null,
            ),
          );
        } else if (stateData?.states && Array.isArray(stateData.states)) {
          setStates(
            stateData.states.filter(
              (state: State) => state.id != null && state.name != null,
            ),
          );
        } else {
          setError("Invalid data format for states.");
        }

        if (Array.isArray(statusData)) {
          setStatuses(
            statusData.filter(
              (status: Status) => status.id != null && status.name != null,
            ),
          );
        } else if (statusData?.statuses && Array.isArray(statusData.statuses)) {
          setStatuses(
            statusData.statuses.filter(
              (status: Status) => status.id != null && status.name != null,
            ),
          );
        } else {
          setError("Invalid data format for statuses.");
        }

        if (Array.isArray(customerData)) {
          setCustomers(
            customerData.filter(
              (customer: Customer) =>
                customer.id != null &&
                customer.firstName != null &&
                customer.lastName != null,
            ),
          );
        } else if (
          customerData?.customers &&
          Array.isArray(customerData.customers)
        ) {
          setCustomers(
            customerData.customers.filter(
              (customer: Customer) =>
                customer.id != null &&
                customer.firstName != null &&
                customer.lastName != null,
            ),
          );
        } else {
          setError("Invalid data format for customers.");
        }

        if (Array.isArray(agentData)) {
          setAgents(
            agentData.filter(
              (agent: Agent) =>
                agent.id != null &&
                agent.firstName != null &&
                agent.lastName != null,
            ),
          );
        } else if (agentData?.agents && Array.isArray(agentData.agents)) {
          setAgents(
            agentData.agents.filter(
              (agent: Agent) =>
                agent.id != null &&
                agent.firstName != null &&
                agent.lastName != null,
            ),
          );
        } else {
          setError("Invalid data format for agents.");
        }

        if (Array.isArray(partnerData?.partners)) {
          setPartners(
            partnerData.partners.filter(
              (partner: Partner) =>
                partner.id != null &&
                partner.firstName != null &&
                partner.lastName != null,
            ),
          );
        } else {
          setError("Invalid data format for partners.");
        }
      } catch (error) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (field: string, value: any) => {
    setUpdatedOrder((prev) => {
      if (
        field === "status" ||
        field === "state" ||
        field === "customer" ||
        field === "agent" ||
        field === "partner" ||
        field === "paymentMethod"
      ) {
        return { ...prev, [field]: { id: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedOrder.amountExclTaxe < 0 || updatedOrder.amountTTC < 0) {
      setError("Amounts must be non-negative");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate({ ...updatedOrder, updatedAt: new Date() });
      onClose();
    } catch (error) {
      setError("An error occurred while updating the order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrderItems = () => {
    setShowOrderItemsModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl border border-gray-300 bg-white p-10 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-900">
          Edit Order
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Amount Excl. Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Excl. Tax
            </label>
            <input
              type="number"
              value={updatedOrder.amountExclTaxe}
              onChange={(e) =>
                handleChange("amountExclTaxe", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount excl. tax"
            />
          </div>

          {/* Amount TTC */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount TTC
            </label>
            <input
              type="number"
              value={updatedOrder.amountTTC}
              onChange={(e) =>
                handleChange("amountTTC", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount TTC"
            />
          </div>

          {/* Amount Before Promo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Before Promo
            </label>
            <input
              type="number"
              value={updatedOrder.amountBeforePromo}
              onChange={(e) =>
                handleChange("amountBeforePromo", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount before promo"
            />
          </div>

          {/* Amount After Promo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount After Promo
            </label>
            <input
              type="number"
              value={updatedOrder.amountAfterPromo}
              onChange={(e) =>
                handleChange("amountAfterPromo", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount after promo"
            />
          </div>

          {/* Amount Refunded */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Refunded
            </label>
            <input
              type="number"
              value={updatedOrder.amountRefunded}
              onChange={(e) =>
                handleChange("amountRefunded", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount refunded"
            />
          </div>
          {/* Amount Ordered */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Ordered
            </label>
            <input
              type="number"
              value={updatedOrder.amountOrdered}
              onChange={(e) =>
                handleChange("amountOrdered", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount ordered"
            />
          </div>

          {/* Amount Shipped */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Shipped
            </label>
            <input
              type="number"
              value={updatedOrder.amountShipped}
              onChange={(e) =>
                handleChange("amountShipped", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount shipped"
            />
          </div>

          {/* Amount Canceled */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Canceled
            </label>
            <input
              type="number"
              value={updatedOrder.amountCanceled}
              onChange={(e) =>
                handleChange("amountCanceled", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount canceled"
            />
          </div>
          {/* Shipping Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shipping Method
            </label>
            <input
              type="text"
              value={updatedOrder.shippingMethod || ""}
              onChange={(e) => handleChange("shippingMethod", e.target.value)}
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter shipping method"
            />
          </div>

          {/* Loyalty Points Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loyalty Points Value
            </label>
            <input
              type="number"
              value={updatedOrder.loyaltyPtsValue || 0}
              onChange={(e) =>
                handleChange("loyaltyPtsValue", Number(e.target.value))
              }
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter loyalty points value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <input
              type="text"
              value={updatedOrder.paymentMethod.name}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter payment method"
            />
          </div>

          {/* From Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Mobile
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Is this order from a mobile device?
              </span>
              <label className="inline-flex cursor-pointer items-center">
                <span className="mr-2 text-sm text-gray-600">No</span>
                <input
                  type="checkbox"
                  checked={updatedOrder.fromMobile || false}
                  onChange={(e) => handleChange("fromMobile", e.target.checked)}
                  className="toggle-checkbox hidden"
                />
                <span
                  className={`toggle-slider relative inline-block h-6 w-12 rounded-full transition-all duration-300 ease-in-out ${
                    updatedOrder.fromMobile ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ease-in-out ${
                      updatedOrder.fromMobile ? "translate-x-6 transform" : ""
                    }`}
                  ></span>
                </span>
                <span className="ml-2 text-sm text-gray-600">Yes</span>
              </label>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              type="number"
              value={updatedOrder.weight || 0}
              onChange={(e) => handleChange("weight", Number(e.target.value))}
              className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight"
            />
          </div>

          {/* State Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            {loading ? (
              <p>Loading states...</p>
            ) : (
              <select
                value={updatedOrder.state?.id || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            {loading ? (
              <p>Loading statuses...</p>
            ) : (
              <select
                value={updatedOrder.status?.id || ""}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            {loading ? (
              <p>Loading customers...</p>
            ) : (
              <select
                value={updatedOrder.customer?.id || ""}
                onChange={(e) => handleChange("customer", e.target.value)}
                className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Agent Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent
            </label>
            {loading ? (
              <p>Loading agents...</p>
            ) : (
              <select
                value={updatedOrder.agent?.id || ""}
                onChange={(e) => handleChange("agent", e.target.value)}
                className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Partner Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Partner
            </label>
            {loading ? (
              <p>Loading partners...</p>
            ) : (
              <select
                value={updatedOrder.partner?.id || ""}
                onChange={(e) => handleChange("partner", e.target.value)}
                className="w-full rounded-md border px-4 py-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Partner</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.firstName} {partner.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Edit Order Items Button */}
        <button
          type="button"
          onClick={handleEditOrderItems}
          className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Edit Order Items
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-sm text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-md px-6 py-3 text-sm font-semibold focus:outline-none ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Updating..." : "Update Order"}
          </button>
        </div>
      </form>

      {showOrderItemsModal && (
        <ModalOrderItems
          isOpen={showOrderItemsModal}
          orderItems={updatedOrder.orderItems || []} // `updatedOrder.orderItems` should be an array of OrderItemWithRelations
          onClose={() => setShowOrderItemsModal(false)}
          onUpdate={(updatedItems: OrderItemWithRelations[]) => {
            setUpdatedOrder((prevOrder) => ({
              ...prevOrder,
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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NewOrderPage = () => {
  const [amountExclTaxe, setAmountExclTaxe] = useState<number | string>("");
  const [amountTTC, setAmountTTC] = useState<number | string>("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [statusId, setStatusId] = useState("");
  const [stateId, setStateId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [amountBeforePromo, setAmountBeforePromo] = useState<number | string>(
    "",
  );
  const [amountAfterPromo, setAmountAfterPromo] = useState<number | string>("");
  const [amountRefunded, setAmountRefunded] = useState<number | string>("");
  const [amountCanceled, setAmountCanceled] = useState<number | string>("");
  const [amountOrdered, setAmountOrdered] = useState<number | string>("");
  const [amountShipped, setAmountShipped] = useState<number | string>("");
  const [weight, setWeight] = useState<number | string>("");
  const [loyaltyPtsValue, setLoyaltyPtsValue] = useState<number | string>("");
  const [fromMobile, setFromMobile] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationItems, setReservationItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentMethodsRes = await fetch(
          "/api/marketplace/payment_method/getAll",
        );
        const paymentMethodsData = await paymentMethodsRes.json();
        const paymentMethodsList = paymentMethodsData.orderPayments.map(
          (payment: any) => ({
            id: payment.id,
            name: payment.name,
          }),
        );
        setPaymentMethods(paymentMethodsList);

        const statesRes = await fetch("/api/marketplace/state/getAll");
        const statesData = await statesRes.json();
        if (statesData && Array.isArray(statesData.states)) {
          setStates(statesData.states);
        } else {
          setError("Invalid states data format");
        }

        const statusesRes = await fetch("/api/marketplace/status/getAll");
        const statusesData = await statusesRes.json();
        if (statusesData && Array.isArray(statusesData.statuses)) {
          setStatuses(statusesData.statuses);
        } else {
          setError("Invalid statuses data format");
        }

        const customersRes = await fetch("/api/marketplace/customers/getAll");
        const customersData = await customersRes.json();

        if (customersData && Array.isArray(customersData.customers)) {
          const validCustomers = customersData.customers.filter(
            (customer: any) => customer.firstName && customer.lastName,
          );
          setCustomers(validCustomers);
        } else {
          setError("Invalid customers data format");
        }

        const agentsRes = await fetch("/api/marketplace/agents/getAll");
        const agentsData = await agentsRes.json();
        if (agentsData && Array.isArray(agentsData.agents)) {
          setAgents(agentsData.agents);
        } else {
          setError("Invalid agents data format");
        }
        const reservationsRes = await fetch(
          "/api/marketplace/reservation/getAll",
        );
        const reservationsData = await reservationsRes.json();
        console.log("API Response:", reservationsData);
        if (reservationsData && Array.isArray(reservationsData.reservations)) {
          setReservations(reservationsData.reservations);
        } else {
          setError("Invalid reservations data format");
        }
      } catch (error) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (stateId) {
      const filtered = statuses.filter((status) => status.stateId === stateId);
      setFilteredStatuses(filtered);
      setStatusId("");
    } else {
      setFilteredStatuses([]);
      setStatusId("");
    }
  }, [stateId, statuses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !amountExclTaxe ||
      !amountTTC ||
      !shippingMethod ||
      !statusId ||
      !stateId ||
      !customerId ||
      !agentId ||
      !paymentMethodId ||
      !amountBeforePromo ||
      !amountAfterPromo ||
      !amountRefunded ||
      !amountCanceled ||
      !amountOrdered ||
      !amountShipped ||
      !weight ||
      !reservationId ||
      selectedItems.length === 0
    ) {
      setError("Required fields are missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/marketplace/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountExclTaxe,
          amountTTC,
          shippingMethod,
          statusId,
          stateId,
          customerId,
          agentId,
          paymentMethodId,
          amountBeforePromo,
          amountAfterPromo,
          amountRefunded,
          amountCanceled,
          amountOrdered,
          amountShipped,
          weight,
          loyaltyPtsValue,
          fromMobile,
          reservationId,
          orderItems: selectedItems.map((item) => ({
            productId: item.productId,
            qteOrdered: item.qteOrdered,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      setSuccess("Order created successfully!");
      setTimeout(() => {
        router.push("/orders2/all");
      }, 1500);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-60 flex min-h-screen w-full items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl transform rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
          New Order
        </h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-lg bg-green-100 p-2 text-sm text-green-600">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">
                Amount Excl. Tax
              </label>
              <input
                type="number"
                value={amountExclTaxe}
                onChange={(e) => setAmountExclTaxe(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Amount TTC
              </label>
              <input
                type="number"
                value={amountTTC}
                onChange={(e) => setAmountTTC(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">
                Shipping Method
              </label>
              <input
                type="text"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">State</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
                disabled={!stateId}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {stateId ? "Select Status" : "Select State first"}
                </option>
                {filteredStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Customer
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">Agent</label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">
                Amount Before Promo
              </label>
              <input
                type="number"
                value={amountBeforePromo}
                onChange={(e) => setAmountBeforePromo(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Amount After Promo
              </label>
              <input
                type="number"
                value={amountAfterPromo}
                onChange={(e) => setAmountAfterPromo(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">
                Amount Refunded
              </label>
              <input
                type="number"
                value={amountRefunded}
                onChange={(e) => setAmountRefunded(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Amount Canceled
              </label>
              <input
                type="number"
                value={amountCanceled}
                onChange={(e) => setAmountCanceled(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">
                Amount Ordered
              </label>
              <input
                type="number"
                value={amountOrdered}
                onChange={(e) => setAmountOrdered(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Amount Shipped
              </label>
              <input
                type="number"
                value={amountShipped}
                onChange={(e) => setAmountShipped(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700">Weight</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Loyalty Points Value
              </label>
              <input
                type="number"
                value={loyaltyPtsValue}
                onChange={(e) => setLoyaltyPtsValue(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              checked={fromMobile}
              onChange={(e) => setFromMobile(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-gray-700">
              From Mobile{" "}
              <span className="text-sm text-gray-500">(mobile device)</span>
            </label>
          </div>

          {/* Réservation */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-2">
              <label className="block font-medium text-gray-700">
                Reservation
              </label>
              <select
                value={reservationId}
                onChange={async (e) => {
                  setReservationId(e.target.value);
                  if (e.target.value) {
                    try {
                      const response = await fetch(
                        `/api/marketplace/reservation_items/getAll?reservationId=${e.target.value}`,
                      );
                      const data = await response.json();
                      setReservationItems(data.items || []);
                    } catch (error) {
                      setError("Failed to load reservation items");
                    }
                  } else {
                    setReservationItems([]);
                  }
                  setSelectedItems([]);
                }}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Reservation</option>
                {reservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    Reservation #{reservation.id}
                    {reservation.customer &&
                      ` - ${reservation.customer.firstName} ${reservation.customer.lastName}`}
                    {reservation.createdAt &&
                      ` - ${new Date(
                        reservation.createdAt,
                      ).toLocaleDateString()}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reservation Items */}
          {reservationItems.length > 0 && (
            <div className="col-span-2">
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Reservation Items
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {reservationItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      selectedItems.some((selected) => selected.id === item.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.product?.name || "Unknown Product"}
                      </p>
                      <div className="mt-1 grid grid-cols-3 gap-2 text-sm text-gray-600">
                        <p>SKU: {item.sku}</p>
                        <p>Qty: {item.qteOrdered}</p>
                        <p>Price: {item.discountedPrice} DH</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          selectedItems.some(
                            (selected) => selected.id === item.id,
                          )
                        ) {
                          setSelectedItems(
                            selectedItems.filter(
                              (selected) => selected.id !== item.id,
                            ),
                          );
                        } else {
                          setSelectedItems([...selectedItems, item]);
                        }
                      }}
                      className={`ml-3 rounded px-2 py-1 text-xs font-medium ${
                        selectedItems.some(
                          (selected) => selected.id === item.id,
                        )
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedItems.some((selected) => selected.id === item.id)
                        ? "Selected"
                        : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push("/orders2/all")}
              className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewOrderPage;

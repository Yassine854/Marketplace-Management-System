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
      } catch (error) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

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
      !paymentMethodId ||
      !amountBeforePromo ||
      !amountAfterPromo ||
      !amountRefunded ||
      !amountCanceled ||
      !amountOrdered ||
      !amountShipped ||
      !weight ||
      !loyaltyPtsValue
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
    <div className="mt-56 flex min-h-screen w-full items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl transform rounded-2xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
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
              <label
                htmlFor="amountExclTaxe"
                className="block font-medium text-gray-700"
              >
                Amount Excl. Tax
              </label>
              <input
                type="number"
                value={amountExclTaxe}
                onChange={(e) => setAmountExclTaxe(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Excl. Tax"
              />
            </div>
            <div>
              <label
                htmlFor="amountTTC"
                className="block font-medium text-gray-700"
              >
                Amount TTC
              </label>
              <input
                type="number"
                value={amountTTC}
                onChange={(e) => setAmountTTC(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount TTC"
              />
            </div>
            <div>
              <label
                htmlFor="shippingMethod"
                className="block font-medium text-gray-700"
              >
                Shipping Method
              </label>
              <input
                type="text"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Shipping Method"
              />
            </div>
            <div>
              <label
                htmlFor="statusId"
                className="block font-medium text-gray-700"
              >
                Status
              </label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="stateId"
                className="block font-medium text-gray-700"
              >
                State
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="customerId "
                className="block font-medium text-gray-700"
              >
                Customer
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentMethodId"
                className="block font-medium text-gray-700"
              >
                Payment Method
              </label>
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="amountBeforePromo"
                className="block font-medium text-gray-700"
              >
                Amount Before Promo
              </label>
              <input
                type="number"
                value={amountBeforePromo}
                onChange={(e) => setAmountBeforePromo(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Before Promo"
              />
            </div>
            <div>
              <label
                htmlFor="amountAfterPromo"
                className="block font-medium text-gray-700"
              >
                Amount After Promo
              </label>
              <input
                type="number"
                value={amountAfterPromo}
                onChange={(e) => setAmountAfterPromo(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount After Promo"
              />
            </div>
            <div>
              <label
                htmlFor="amountRefunded"
                className="block font-medium text-gray-700"
              >
                Amount Refunded
              </label>
              <input
                type="number"
                value={amountRefunded}
                onChange={(e) => setAmountRefunded(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Refunded"
              />
            </div>
            <div>
              <label
                htmlFor="amountCanceled"
                className="block font-medium text-gray-700"
              >
                Amount Canceled
              </label>
              <input
                type="number"
                value={amountCanceled}
                onChange={(e) => setAmountCanceled(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Canceled"
              />
            </div>
            <div>
              <label
                htmlFor="amountOrdered"
                className="block font-medium text-gray-700"
              >
                Amount Ordered
              </label>
              <input
                type="number"
                value={amountOrdered}
                onChange={(e) => setAmountOrdered(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Ordered"
              />
            </div>
            <div>
              <label
                htmlFor="amountShipped"
                className="block font-medium text-gray-700"
              >
                Amount Shipped
              </label>
              <input
                type="number"
                value={amountShipped}
                onChange={(e) => setAmountShipped(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount Shipped"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block font-medium text-gray-700"
              >
                Weight
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Weight"
              />
            </div>
            <div>
              <label
                htmlFor="loyaltyPtsValue"
                className="block font-medium text-gray-700"
              >
                Loyalty Points Value
              </label>
              <input
                type="number"
                value={loyaltyPtsValue}
                onChange={(e) => setLoyaltyPtsValue(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Loyalty Points Value"
              />
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                checked={fromMobile}
                onChange={(e) => setFromMobile(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 transition duration-200 focus:ring-blue-500"
              />
              <label className="ml-2 text-lg font-medium text-gray-700">
                From Mobile
              </label>
              <span className="ml-2 text-sm text-gray-500">
                (Check if the order is placed from a mobile device)
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/orders2/all")}
              className="flex flex-1 items-center justify-center rounded-lg bg-gray-300 px-4 py-3 font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 hover:text-gray-900 hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400"
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

"use client";
import { useState } from "react";
import { OrderWithRelations } from "../types/order"; // Update the import to your Order type

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
  const [amountCanceled, setAmountCanceled] = useState(order.amountCanceled);
  const [amountOrdered, setAmountOrdered] = useState(order.amountOrdered);
  const [amountShipped, setAmountShipped] = useState(order.amountShipped);
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod);
  const [loyaltyPtsValue, setLoyaltyPtsValue] = useState(order.loyaltyPtsValue);
  const [fromMobile, setFromMobile] = useState(order.fromMobile);
  const [weight, setWeight] = useState(order.weight);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountExclTaxe < 0 || amountTTC < 0) {
      setError("Amounts must be non-negative");
      return;
    }

    const updatedOrder: OrderWithRelations = {
      ...order,
      amountExclTaxe,
      amountTTC,
      amountBeforePromo,
      amountAfterPromo,
      amountRefunded,
      amountCanceled,
      amountOrdered,
      amountShipped,
      shippingMethod,
      loyaltyPtsValue,
      fromMobile,
      weight,
      // Include other necessary fields and relationships as needed
      createdAt: order.createdAt, // Keep original createdAt
      updatedAt: new Date(), // Update the updatedAt field
      status: order.status, // Keep original status
      state: order.state, // Keep original state
      customer: order.customer, // Keep original customer
      agent: order.agent, // Keep original agent
      reservation: order.reservation, // Keep original reservation
      partner: order.partner, // Keep original partner
      orderItems: order.orderItems, // Keep original order items
      loyaltyPoints: order.loyaltyPoints, // Keep original loyalty points
      paymentMethod: order.paymentMethod, // Keep original payment method
    };

    onUpdate(updatedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Order
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Excl. Tax
          </label>
          <input
            type="number"
            value={amountExclTaxe}
            onChange={(e) => setAmountExclTaxe(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount TTC
          </label>
          <input
            type="number"
            value={amountTTC}
            onChange={(e) => setAmountTTC(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Before Promo
          </label>
          <input
            type="number"
            value={amountBeforePromo}
            onChange={(e) => setAmountBeforePromo(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount After Promo
          </label>
          <input
            type="number"
            value={amountAfterPromo}
            onChange={(e) => setAmountAfterPromo(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Refunded
          </label>
          <input
            type="number"
            value={amountRefunded}
            onChange={(e) => setAmountRefunded(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Canceled
          </label>
          <input
            type="number"
            value={amountCanceled}
            onChange={(e) => setAmountCanceled(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Ordered
          </label>
          <input
            type="number"
            value={amountOrdered}
            onChange={(e) => setAmountOrdered(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Shipped
          </label>
          <input
            type="number"
            value={amountShipped}
            onChange={(e) => setAmountShipped(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipping Method
          </label>
          <input
            type="text"
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loyalty Points Value
          </label>
          <input
            type="number"
            value={loyaltyPtsValue}
            onChange={(e) => setLoyaltyPtsValue(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Mobile
          </label>
          <input
            type="checkbox"
            checked={fromMobile}
            onChange={(e) => setFromMobile(e.target.checked)}
            className="mr-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderForm;

import { useState, useEffect, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Order } from "@/features/marketplace/orders/types/order";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (orderData: {
    id: string;
    deliveryDate?: string; // ISO string
  }) => void;
  initialData: Order | null;
}

const EditOrderModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: EditOrderModalProps) => {
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  // Prefill delivery date
  useEffect(() => {
    if (initialData && (initialData as any).deliveryDate) {
      const d = new Date((initialData as any).deliveryDate as any);
      if (!isNaN(d.getTime())) {
        // Convert to local datetime-local format (YYYY-MM-DDTHH:mm)
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDeliveryDate(local);
      } else {
        setDeliveryDate("");
      }
    } else if (initialData) {
      setDeliveryDate("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return;
    const payload: any = { id: initialData.id };
    if (deliveryDate) {
      payload.deliveryDate = new Date(deliveryDate).toISOString();
    }
    onEdit(payload);
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

        {/* Order Details (Read-only + Delivery Date editable) */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Order Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Delivery Date at top */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Delivery Date
              </label>
              <input
                type="datetime-local"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

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

        {/* Vendor Orders grouped items */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Vendor Orders
          </h3>
          {initialData.orderPartners && initialData.orderPartners.length > 0 ? (
            <div className="space-y-6">
              {initialData.orderPartners.map((vo: any) => {
                // Build a map for quick lookup of full orderItem details
                const itemById = new Map(
                  initialData.orderItems.map((oi: any) => [oi.id, oi]),
                );
                const items = (vo.itemsSnapshot || []).map((snap: any) => {
                  const full = itemById.get(snap.id);
                  return {
                    ...snap,
                    productName: snap.productName ?? full?.product?.name,
                    sku: snap.sku ?? full?.sku,
                    partnerName: full?.source?.partner?.username,
                    sourceName: full?.source?.name,
                  };
                });
                const total =
                  vo.order_total_ttc ??
                  vo.order_total_ht ??
                  items.reduce(
                    (sum: number, it: any) =>
                      sum +
                      (typeof it.total_ht === "number"
                        ? it.total_ht
                        : (it.qteOrdered ?? 0) *
                          (it.specialPrice ?? it.unitPrice ?? 0)),
                    0,
                  );
                return (
                  <div key={vo.id} className="rounded border border-gray-100">
                    <div className="flex items-center justify-between bg-gray-50 p-3">
                      <div className="text-sm text-gray-700">
                        <div className="font-semibold">
                          {vo.orderCode} — {vo.partner?.username || "Vendor"}
                        </div>
                        <div className="text-xs text-gray-500">
                          State: {vo.state?.name || "-"} • Status:{" "}
                          {vo.status?.name || "-"}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Total: {total.toFixed(2)} TND
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-white">
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
                              Unit Price
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Source
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {items.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-900">
                                {item.productName || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {item.sku}
                              </td>
                              <td className="px-3 py-2 text-gray-900">
                                {item.qteOrdered}
                              </td>
                              <td className="px-3 py-2 text-gray-900">
                                {(
                                  item.specialPrice ??
                                  item.unitPrice ??
                                  0
                                ).toFixed(2)}{" "}
                                TND
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {`${item.sourceName || "N/A"}`}
                              </td>
                              <td className="px-3 py-2 text-gray-900">
                                {(typeof item.total_ht === "number"
                                  ? item.total_ht
                                  : (item.qteOrdered ?? 0) *
                                    (item.specialPrice ?? item.unitPrice ?? 0)
                                ).toFixed(2)}{" "}
                                TND
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No vendor orders found.</div>
          )}
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

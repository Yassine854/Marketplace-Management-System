import { useState } from "react";
import { Reservation, ReservationItem } from "../types/reservation";
import { X, Package, Scale, Tag, Percent } from "lucide-react";

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSave: (updatedReservation: Reservation) => Promise<void> | void;
}

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onSave,
}: EditReservationModalProps) => {
  const [editedReservation, setEditedReservation] =
    useState<Reservation>(reservation);
  const [isSaving, setIsSaving] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setEditedReservation((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBooleanChange = (name: string, value: boolean) => {
    setEditedReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(editedReservation);
      onClose();
    } catch (error) {
      console.error("Failed to save reservation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="my-8 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Reservation
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  ID: #{editedReservation.id}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 transition-colors hover:text-gray-500"
                disabled={isSaving}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowItems(!showItems)}
                className="flex items-center rounded-md bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
              >
                <Package className="mr-2 h-5 w-5" />
                {showItems
                  ? "Hide Items"
                  : `Show Items (${editedReservation.reservationItems.length})`}
              </button>
            </div>

            {showItems && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Reservation Items
                </h3>
                <div className="max-h-60 space-y-4 overflow-y-auto">
                  {editedReservation.reservationItems.map(
                    (item: ReservationItem) => (
                      <div
                        key={item.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {item.productName || "Unknown Product"}
                          </h4>
                          <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center">
                            <Tag className="text-blue -500 mr-1 h-4 w-4" />
                            <span>Price: {item.discountedPrice} DT</span>
                          </div>
                          <div className="flex items-center">
                            <Percent className="mr-1 h-4 w-4 text-blue-500" />
                            <span>Qty: {item.qteReserved}</span>
                          </div>
                          <div className="flex items-center">
                            <Scale className="mr-1 h-4 w-4 text-blue-500" />
                            <span>Weight: {item.weight}</span>
                          </div>

                          <div className="flex items-center">
                            <Scale className="mr-1 h-4 w-4 text-blue-500" />
                            <span>Taxe: {item.taxValue}</span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-medium text-gray-900">
                  Financial Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Excl Tax (DT)
                    </label>
                    <input
                      name="amountExclTaxe"
                      type="number"
                      value={editedReservation.amountExclTaxe}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount TTC (DT)
                    </label>
                    <input
                      name="amountTTC"
                      type="number"
                      value={editedReservation.amountTTC}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Before Promo (DT)
                    </label>
                    <input
                      name="amountBeforePromo"
                      type="number"
                      value={editedReservation.amountBeforePromo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount After Promo (DT)
                    </label>
                    <input
                      name="amountAfterPromo"
                      type="number"
                      value={editedReservation.amountAfterPromo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-medium text-gray-900">
                  Status Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      value={editedReservation.isActive ? "true" : "false"}
                      onChange={(e) =>
                        handleBooleanChange(
                          "isActive",
                          e.target.value === "true",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      From Mobile
                    </label>
                    <select
                      value={editedReservation.fromMobile ? "true" : "false"}
                      onChange={(e) =>
                        handleBooleanChange(
                          "fromMobile",
                          e.target.value === "true",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Shipping Method
                    </label>
                    <input
                      name="shippingMethod"
                      type="text"
                      value={editedReservation.shippingMethod}
                      onChange={handleChange}
                      className="mt -1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Loyalty Points Value
                    </label>
                    <input
                      name="loyaltyPtsValue"
                      type="number"
                      value={editedReservation.loyaltyPtsValue}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-medium text-gray-900">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Customer
                    </label>
                    <input
                      type="text"
                      value={`${editedReservation.customer?.firstName || ""} ${
                        editedReservation.customer?.lastName || ""
                      }`}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Agent
                    </label>
                    <input
                      type="text"
                      value={
                        editedReservation.agent
                          ? `${editedReservation.agent.firstName} ${editedReservation.agent.lastName}`
                          : "—"
                      }
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Partner
                    </label>
                    <input
                      type="text"
                      value={`${editedReservation.partner?.firstName || ""} ${
                        editedReservation.partner?.lastName || ""
                      }`}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={editedReservation.paymentMethod?.name || ""}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Weight
                    </label>
                    <input
                      name="weight"
                      type="number"
                      value={editedReservation.weight}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Created At
                    </label>
                    <input
                      type="text"
                      value={formatDate(editedReservation.createdAt)}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Updated At
                    </label>
                    <input
                      type="text"
                      value={formatDate(editedReservation.updatedAt)}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Items Count
                    </label>
                    <input
                      type="text"
                      value={editedReservation.reservationItems.length}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-medium text-gray-900">
                  Transaction Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Refunded (DT)
                    </label>
                    <input
                      name="amountRefunded"
                      type="number"
                      value={editedReservation.amountRefunded}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Canceled (DT)
                    </label>
                    <input
                      name="amountCanceled"
                      type="number"
                      value={editedReservation.amountCanceled}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Ordered (DT)
                    </label>
                    <input
                      name="amountOrdered"
                      type="number"
                      value={editedReservation.amountOrdered}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Shipped (DT)
                    </label>
                    <input
                      name="amountShipped"
                      type="number"
                      value={editedReservation.amountShipped}
                      onChange={handleChange}
                      className="focus ```javascript .border-blue-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm
                      focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 inline h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;

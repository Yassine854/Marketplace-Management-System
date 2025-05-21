import { useState, useEffect } from "react";
import { Reservation, ReservationItem } from "../types/reservation";
import {
  X,
  Package,
  Scale,
  Tag,
  Percent,
  CheckCircle,
  Users,
} from "lucide-react";
interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSave: (updatedReservation: Reservation) => Promise<void> | void;
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <h3 className="mb-6 flex items-center space-x-2 text-lg font-semibold text-gray-900">
    <span className="rounded-lg bg-blue-100 p-2">
      <Icon className="h-5 w-5 text-blue-600" />
    </span>
    <span>{title}</span>
  </h3>
);

const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      readOnly
      value={value}
      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 shadow-sm"
    />
  </div>
);

const ReservationItemCard = ({ item }: { item: ReservationItem }) => (
  <div className="rounded-lg border border-gray-100 bg-white p-4 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-gray-900">
        {item.productName || "Unknown Product"}
      </h4>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
        SKU: {item.sku}
      </span>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
      <div className="flex items-center space-x-2 text-gray-600">
        <Tag className="h-4 w-4 text-blue-500" />
        <span>{item.discountedPrice} DT</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-600">
        <Package className="h-4 w-4 text-blue-500" />
        <span>Qty: {item.qteReserved}</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-600">
        <Scale className="h-4 w-4 text-blue-500" />
        <span>{item.weight}</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-600">
        <Percent className="h-4 w-4 text-blue-500" />
        <span>Tax: {item.taxValue}%</span>
      </div>
    </div>
  </div>
);

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onSave,
}: EditReservationModalProps) => {
  const [editedReservation, setEditedReservation] = useState(reservation);
  const [isSaving, setIsSaving] = useState(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    setEditedReservation(reservation);
  }, [reservation]);

  const handleStatusChange = (value: string) => {
    setEditedReservation((prev) => ({ ...prev, isActive: value === "true" }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="my-8 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Reservation
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    ID: #{editedReservation.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                aria-label="Close modal"
                disabled={isSaving}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 p-8">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowItems(!showItems)}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <Package className="h-5 w-5" />
                <span>
                  {showItems
                    ? "Hide Items"
                    : `Show Items (${editedReservation.reservationItems.length})`}
                </span>
              </button>
            </div>

            {showItems && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <SectionHeader icon={Tag} title="Reservation Items" />
                <div className="grid gap-4 md:grid-cols-2">
                  {editedReservation.reservationItems.map((item) => (
                    <ReservationItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Financial Information Section */}
              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={Percent} title="Financial Information" />
                <div className="space-y-4">
                  {[
                    {
                      label: "Amount Excl Taxe",
                      value: editedReservation.amountExclTaxe,
                    },
                    { label: "Amount TTC", value: editedReservation.amountTTC },
                    {
                      label: "Amount Before Promo",
                      value: editedReservation.amountBeforePromo,
                    },
                    {
                      label: "Amount After Promo",
                      value: editedReservation.amountAfterPromo,
                    },
                  ].map((field) => (
                    <ReadOnlyField
                      key={field.label}
                      label={`${field.label} (DT)`}
                      value={field.value}
                    />
                  ))}
                </div>
              </div>

              {/* Status Information Section */}
              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={CheckCircle} title="Status Information" />
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      value={String(editedReservation.isActive)}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <ReadOnlyField
                    label="From Mobile"
                    value={editedReservation.fromMobile ? "Yes" : "No"}
                  />
                  <ReadOnlyField
                    label="Shipping Method"
                    value={editedReservation.shippingMethod || ""}
                  />
                  <ReadOnlyField
                    label="Loyalty Points Value"
                    value={editedReservation.loyaltyPtsValue || 0}
                  />
                  <ReadOnlyField
                    label="Weight"
                    value={`${editedReservation.weight}`}
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={Users} title="Additional Information" />
                <div className="space-y-4">
                  <ReadOnlyField
                    label="Customer"
                    value={`${editedReservation.customer?.firstName || ""} ${
                      editedReservation.customer?.lastName || ""
                    }`}
                  />
                  <ReadOnlyField
                    label="Agent"
                    value={
                      editedReservation.agent
                        ? `${editedReservation.agent.firstName} ${editedReservation.agent.lastName}`
                        : "—"
                    }
                  />
                  <ReadOnlyField
                    label="Partner"
                    value={
                      editedReservation.partner
                        ? `${editedReservation.partner.firstName} ${editedReservation.partner.lastName}`
                        : "—"
                    }
                  />
                  <ReadOnlyField
                    label="Created At"
                    value={new Date(
                      editedReservation.createdAt,
                    ).toLocaleDateString("fr-FR")}
                  />
                  <ReadOnlyField
                    label="Updated At"
                    value={new Date(
                      editedReservation.updatedAt,
                    ).toLocaleDateString("fr-FR")}
                  />
                </div>
              </div>

              {/* Transaction Details Section */}
              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={Tag} title="Transaction Details" />
                <div className="space-y-4">
                  {[
                    {
                      label: "Amount Refunded",
                      value: editedReservation.amountRefunded,
                    },
                    {
                      label: "Amount Canceled",
                      value: editedReservation.amountCanceled,
                    },
                    {
                      label: "Amount Ordered",
                      value: editedReservation.amountOrdered,
                    },
                    {
                      label: "Amount Shipped",
                      value: editedReservation.amountShipped,
                    },
                  ].map((field) => (
                    <ReadOnlyField
                      key={field.label}
                      label={`${field.label} (DT)`}
                      value={field.value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white px-8 py-6 shadow-sm">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                {isSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;

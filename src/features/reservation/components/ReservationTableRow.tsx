import { Reservation } from "../types/reservation";
import { downloadReservationPDF } from "../utils/pdfUtils";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal/modal";
import EditReservationModal from "./EditReservationModal";
import {
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CreditCardIcon,
  UserIcon,
  NoSymbolIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
type ReservationTableRowProps = {
  reservation: Reservation;
  onDelete: (id: string) => Promise<void>;
};

const UserInfoCell = ({
  user,
  label,
}: {
  user?: { firstName?: string; lastName?: string };
  label: string;
}) => (
  <td className="whitespace-nowrap px-6 py-4">
    {user ? (
      <div
        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-blue-700"
        title={`${user.firstName} ${user.lastName}`}
      >
        <UserIcon className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-[150px] truncate">
          {user.firstName} {user.lastName}
        </span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-500">
        <NoSymbolIcon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
      </div>
    )}
  </td>
);
const isNumber = (value: unknown): value is number => typeof value === "number";

const StatusBadge = ({ value, label }: { value: number; label: string }) => (
  <td className="min-w-[150px] px-6 py-4 text-sm text-gray-900">
    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1">
      <TruckIcon className="h-4 w-4 text-amber-600" />
      <span className="max-w-[150px] truncate text-amber-700" title={label}>
        {label || "—"}
      </span>
    </div>
  </td>
);

const formatDate = (date: Date) => new Date(date).toLocaleDateString("fr-FR");

const ReservationTableRow = ({
  reservation,
  onDelete,
}: ReservationTableRowProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDownloadPDF = () => downloadReservationPDF([reservation]);

  const handleSaveReservation = async (updatedReservation: Reservation) => {
    try {
      const response = await fetch("/api/marketplace/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedReservation,
          reservationId: updatedReservation.id,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Reservation saved successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        {/* ID Column */}
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          #{reservation.id}
        </td>

        {[
          "amountExclTaxe",
          "amountTTC",
          "amountBeforePromo",
          "amountAfterPromo",
          "amountRefunded",
          "amountCanceled",
          "amountOrdered",
          "amountShipped",
        ].map((field) => {
          const value = reservation[field as keyof Reservation];
          return (
            <td key={field} className="px-6 py-4 text-sm text-gray-900">
              {isNumber(value) ? `${value} DT` : "N/A"}
            </td>
          );
        })}

        <StatusBadge
          value={reservation.amountShipped}
          label={reservation.shippingMethod}
        />

        {/* Status Columns */}
        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.isActive ? "Active" : "Inactive"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.loyaltyPtsValue}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.fromMobile ? "Yes" : "No"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.weight}
        </td>

        {/* User Info Columns */}
        <UserInfoCell user={reservation.customer} label="N/A" />
        <UserInfoCell user={reservation.agent} label="N/A" />
        <UserInfoCell user={reservation.partner} label="N/A" />

        {/* Payment Method */}
        <td className="min-w-[180px] whitespace-nowrap px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700">
            <CreditCardIcon className="h-5 w-5" />
            <span className="truncate font-medium">
              {reservation.paymentMethod.name}
            </span>
          </div>
        </td>

        {/* Dates */}
        <td className="px-8 py-4 text-sm text-gray-900">
          {formatDate(reservation.createdAt)}
        </td>
        <td className="px-8 py-4 text-sm text-gray-900">
          {formatDate(reservation.updatedAt)}
        </td>

        {/* Items Button */}
        <td className="min-w-[200px] px-4 py-4">
          <button
            className="flex w-full items-center justify-center gap-1 rounded bg-green-50 px-4 py-2 text-green-600 transition-colors hover:bg-green-100 hover:underline"
            onClick={() => setShowModal(true)}
          >
            View Items ({reservation.reservationItems.length})
          </button>
        </td>

        {/* Action Buttons */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <ActionButton
              icon={PencilIcon}
              onClick={() => setShowEditModal(true)}
              color="yellow"
              ariaLabel="Edit"
            />
            <ActionButton
              icon={TrashIcon}
              onClick={() => onDelete(reservation.id)}
              color="red"
              ariaLabel="Delete"
            />
            <ActionButton
              icon={ArrowDownTrayIcon}
              onClick={handleDownloadPDF}
              color="blue"
              ariaLabel="Download PDF"
            />
          </div>
        </td>
      </tr>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        items={reservation.reservationItems}
      />

      <EditReservationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        reservation={reservation}
        onSave={handleSaveReservation}
      />
    </>
  );
};

const ActionButton = ({
  icon: Icon,
  onClick,
  color,
  ariaLabel,
}: {
  icon: React.ElementType;
  onClick: () => void;
  color: string;
  ariaLabel: string;
}) => (
  <button
    onClick={onClick}
    className={`p-1 text-gray-400 transition-colors hover:text-${color}-600`}
    aria-label={ariaLabel}
  >
    <Icon className="h-5 w-5" />
  </button>
);

export default ReservationTableRow;

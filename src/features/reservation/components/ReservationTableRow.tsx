import {
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Reservation } from "../types/reservation";
import { downloadReservationPDF } from "../utils/pdfUtils";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal/modal";
import EditReservationModal from "./EditReservationModal";

const ReservationTableRow = ({
  reservation,
  onDelete,
}: {
  reservation: Reservation;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleDownloadPDF = () => {
    downloadReservationPDF([reservation]);
  };
  const handleSaveReservation = async (updatedReservation: Reservation) => {
    try {
      const response = await fetch("/api/marketplace/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedReservation,
          reservationId: updatedReservation.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save reservation");
      }

      toast.success("Reservation saved successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {reservation.id}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountExclTaxe} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountTTC} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountBeforePromo} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountAfterPromo} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountRefunded} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountCanceled} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountOrdered} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.amountShipped} DT
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.shippingMethod}
        </td>

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
        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.customer?.firstName} {reservation.customer?.lastName}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.agent
            ? `${reservation.agent.firstName} ${reservation.agent.lastName}`
            : "—"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.partner.firstName} {reservation.partner.lastName}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.paymentMethod?.name}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(reservation.createdAt)}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(reservation.updatedAt)}
        </td>

        <td className="px-6 py-4">
          <div>
            <button
              className="text-blue-600"
              onClick={() => setShowModal(true)}
            >
              View Items ({reservation.reservationItems.length})
            </button>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1 text-gray-400 transition-colors hover:text-yellow-600"
              aria-label="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(reservation.id)}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              aria-label="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
              aria-label="Download PDF"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>

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

export default ReservationTableRow;

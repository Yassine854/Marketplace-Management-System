import { TrashIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Reservation } from "../types/reservation";
import { downloadReservationPDF } from "../utils/pdfUtils";
import { useState } from "react";
import Modal from "../Modal/modal";
const ReservationTableRow = ({
  reservation,
  onDelete,
}: {
  reservation: Reservation;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleDownloadPDF = () => {
    downloadReservationPDF([reservation]);
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
          {reservation.state ? "Active" : "Inactive"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.loyaltyPtsValue}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.fromMobile ? "Yes" : "No"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.weight} kg
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
    </>
  );
};

export default ReservationTableRow;

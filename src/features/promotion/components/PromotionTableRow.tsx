import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import EditPromoForm from "./EditPromoForm"; // Adapter le formulaire d'édition
import { Promotion } from "../types/promo"; // Remplacer Tax par Promotion
import { downloadPromoPDF } from "../utils/pdfUtils"; // Télécharger le PDF des promotions

const PromoTableRow = ({
  promotion,
  onUpdate,
  onDelete,
  onEdit,
}: {
  promotion: Promotion; // Adapter le type pour utiliser Promotion
  onUpdate: (updatedPromotion: Promotion) => void; // Utiliser Promotion au lieu de Tax
  onDelete: (id: string) => Promise<void>;
  onEdit: (promotion: Promotion) => void; // Trigger Edit Form
}) => {
  // Fonction pour formater les dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR"); // Format français (jour/mois/année)
  };

  const handleDownloadPDF = () => {
    downloadPromoPDF([promotion]); // Télécharger le PDF de la promotion
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {promotion.id}
        </td>

        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {promotion.promoPrice} DT
          </div>
        </td>

        {/* Afficher la date de début */}
        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(promotion.startDate)}
        </td>

        {/* Afficher la date de fin */}
        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(promotion.endDate)}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(promotion)} // Edit button triggers the onEdit function
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleDownloadPDF()}
              className="p-1 text-gray-400 transition-colors hover:text-green-600"
              aria-label="Download PDF"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(promotion.id)}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              aria-label="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default PromoTableRow;

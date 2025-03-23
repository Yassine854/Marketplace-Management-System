import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Manufacturer } from "../types/manufacturer";
import { downloadManufacturerPDF } from "../utils/pdfUtils";

const ManufacturerTableRow = ({
  manufacturer,
  onUpdate,
  onDelete,
  onEdit,
}: {
  manufacturer: Manufacturer;
  onUpdate: (updatedManufacturer: Manufacturer) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (manufacturer: Manufacturer) => void;
}) => {
  const handleDownloadPDF = () => {
    downloadManufacturerPDF([manufacturer]);
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {manufacturer.manufacturerId}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{manufacturer.code}</td>
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          {manufacturer.companyName}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.contactName}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.phoneNumber}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.email}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.address}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{manufacturer.city}</td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.country}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {manufacturer.capital}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(manufacturer)}
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
              onClick={() => onDelete(manufacturer.id)}
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

export default ManufacturerTableRow;

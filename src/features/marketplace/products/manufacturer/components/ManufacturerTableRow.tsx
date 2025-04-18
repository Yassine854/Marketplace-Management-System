import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  Manufacturer,
  SupplierCategory,
  Category,
} from "../types/manufacturer";
import { downloadManufacturerPDF } from "../utils/pdfUtils";

interface ManufacturerTableRowProps {
  manufacturer: Manufacturer;
  onDelete: (id: string) => Promise<void>;
  onEdit: (manufacturer: Manufacturer) => void;
  onUpdate?: (updatedManufacturer: Manufacturer) => Promise<void>; // Rendue optionnelle
  categories?: Category[];
}

const ManufacturerTableRow = ({
  manufacturer,
  onDelete,
  onEdit,
}: ManufacturerTableRowProps) => {
  const handleDownloadPDF = () => {
    downloadManufacturerPDF([manufacturer]);
  };

  const getCategoryNames = (supplierCategories?: SupplierCategory[]) => {
    if (!supplierCategories?.length) return "No categories";
    return supplierCategories
      .map((sc) => sc.category?.nameCategory)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <tr className="transition-colors duration-150 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        {manufacturer.manufacturerId || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.code || "-"}
      </td>
      <td className="min-w-[120px] px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {manufacturer.companyName || "-"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.contactName || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.phoneNumber || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.email || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.address || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.city || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.country || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {manufacturer.capital || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {getCategoryNames(manufacturer.supplierCategories)}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(manufacturer)}
            className="p-1 text-gray-400 transition-colors hover:text-blue-600"
            aria-label="Edit manufacturer"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handleDownloadPDF}
            className="p-1 text-gray-400 transition-colors hover:text-green-600"
            aria-label="Download manufacturer details"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => onDelete(manufacturer.id)}
            className="p-1 text-gray-400 transition-colors hover:text-red-600"
            aria-label="Delete manufacturer"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ManufacturerTableRow;

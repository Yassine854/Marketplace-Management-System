// components/SubCategoryTable.tsx
import { SubCategory } from "@/types/subCategory";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";

interface SubCategoryTableProps {
  subcategories: SubCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (id: string) => Promise<void>;
  isSidebarOpen: boolean;
}

export default function SubCategoryTable({
  subcategories,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
  isSidebarOpen,
}: SubCategoryTableProps) {
  const { deleteSubCategory } = useSubCategoryActions();

  const handleDelete = (id: string) => {
    deleteSubCategory(id).then(() => refetch());
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Image
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Created At
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading subcategories...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-red-600">
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && subcategories?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  <p>No subcategories found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              subcategories.map((subcategory) => (
                <tr
                  key={subcategory.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {subcategory.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        subcategory.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subcategory.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {subcategory.image ? (
                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="mx-auto h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mx-auto h-12 w-12 rounded-full bg-gray-200"></div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {subcategory.createdAt
                      ? new Date(subcategory.createdAt).toLocaleDateString()
                      : "No date available"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(subcategory)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(subcategory.id)}
                      className="mx-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

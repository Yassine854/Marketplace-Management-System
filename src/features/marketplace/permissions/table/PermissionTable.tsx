import { FaEdit, FaTrash } from "react-icons/fa";
import { usePermissionActions } from "../hooks/usePermissionActions";
import { Permission } from "@/types/permission";

interface PermissionTableProps {
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
  isSidebarOpen: boolean;
}

export default function PermissionTable({
  permissions,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: PermissionTableProps) {
  const { deletePermission } = usePermissionActions();

  const handleDelete = (id: string) => {
    deletePermission(id).then(() => refetch());
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
                ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Resource
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading permissions...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-red-600">
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

            {!isLoading && !error && permissions?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  <p>No permissions found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              permissions.map((permission) => (
                <tr
                  key={permission.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {permission.id}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {permission.resource}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(permission)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(permission.id)}
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

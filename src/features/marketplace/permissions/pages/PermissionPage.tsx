import PermissionTable from "../table/PermissionTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllPermissions } from "../hooks/useGetAllPermissions";
import { usePermissionActions } from "../hooks/usePermissionActions";
import { useCreatePermission } from "../hooks/useCreatePermission";
import CreatePermissionModal from "../components/CreatePermissionModal";
import EditPermissionModal from "../components/EditPermissionModal";
import { Permission } from "@/types/permission";

const PermissionPage = () => {
  const { permissions, isLoading, error, refetch } = useGetAllPermissions();
  const {
    editPermission,
    deletePermission,
    isLoading: isActionLoading,
    error: actionError,
  } = usePermissionActions();
  const {
    createPermission,
    isLoading: isCreating,
    error: createError,
  } = useCreatePermission();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const handleEdit = async (id: string, updatedPermission: Permission) => {
    try {
      const result = await editPermission(id, updatedPermission);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing permission:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deletePermission(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold capitalize text-gray-900">
              Permissions
            </h1>
            <p className="text-sm text-gray-600">
              Manage your system permissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Loading/Error Status */}
            {(isActionLoading || isCreating) && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            )}

            {(actionError || createError) && (
              <div className="rounded bg-red-50 px-3 py-1 text-sm text-red-700">
                {actionError || createError}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn flex items-center gap-2"
              title="Add new permission"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
              <span className="hidden sm:inline">Add Permission</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <PermissionTable
            permissions={permissions}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            isSidebarOpen={false}
          />
        </div>
      </div>

      {/* Modals */}
      <CreatePermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(permission) => {
          createPermission(permission, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedPermission && (
        <EditPermissionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, updatedPermission) => {
            handleEdit(id, {
              ...selectedPermission,
              ...updatedPermission,
            });
            setIsEditModalOpen(false);
          }}
          id={selectedPermission.id}
          initialResource={selectedPermission.resource}
        />
      )}
    </div>
  );
};

export default PermissionPage;

import RoleTable from "../table/RoleTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllRoles } from "../hooks/useGetAllRoles";
import { useRoleActions } from "../hooks/useRoleActions";
import { useCreateRole } from "../hooks/useCreateRole";
import CreateRoleModal from "../components/CreateRoleModal";
import EditRoleModal from "../components/EditRoleModal";
import { Role } from "@/types/role";

const RolePage = () => {
  const { roles, isLoading, error, refetch } = useGetAllRoles();
  const {
    editRole,
    deleteRole,
    isLoading: isActionLoading,
    error: actionError,
  } = useRoleActions();
  const {
    createRole,
    isLoading: isCreating,
    error: createError,
  } = useCreateRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEdit = async (id: string, updatedRole: Role) => {
    try {
      const result = await editRole(id, updatedRole);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteRole(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
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
              Roles
            </h1>
            <p className="text-sm text-gray-600">Manage your user roles</p>
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
              title="Add new role"
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
              <span className="hidden sm:inline">Add Role</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <RoleTable
            roles={roles}
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
      <CreateRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(role) => {
          createRole(role, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedRole && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, updatedRole) => {
            handleEdit(id, {
              ...selectedRole,
              ...updatedRole,
            });
            setIsEditModalOpen(false);
          }}
          id={selectedRole.id}
          initialName={selectedRole.name}
        />
      )}
    </div>
  );
};

export default RolePage;

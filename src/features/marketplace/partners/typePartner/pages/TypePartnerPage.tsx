import TypePartnerTable from "../table/typePartnerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllTypePartners } from "../hooks/useGetAllTypePartners";
import { TypePartner } from "@/types/typePartner";
import { useTypePartnerActions } from "../hooks/useTypePartnerActions";
import { useCreateTypePartner } from "../hooks/useCreateTypePartner";
import CreateTypePartnerModal from "../components/CreateTypePartnerModal";
import EditTypePartnerModal from "../components/EditTypePartnerModal";

const TypePartnerPage = () => {
  const { typePartners, isLoading, error, refetch } = useGetAllTypePartners();
  const {
    editTypePartner,
    deleteTypePartner,
    isLoading: isActionLoading,
    error: actionError,
  } = useTypePartnerActions();
  const {
    createTypePartner,
    isLoading: isCreating,
    error: createError,
  } = useCreateTypePartner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTypePartner, setSelectedTypePartner] =
    useState<TypePartner | null>(null);

  const handleEdit = async (id: string, updatedTypePartner: TypePartner) => {
    try {
      const result = await editTypePartner(id, updatedTypePartner);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing type partner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTypePartner(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (typePartner: TypePartner) => {
    setSelectedTypePartner(typePartner);
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
              Type Partners
            </h1>
            <p className="text-sm text-gray-600">Manage your partner types</p>
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
              title="Add new type partner"
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
              <span className="hidden sm:inline">Add Type Partner</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <TypePartnerTable
            typePartners={typePartners}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateTypePartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name) => {
          createTypePartner(name, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedTypePartner && (
        <EditTypePartnerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, updatedName) => {
            handleEdit(id, {
              ...selectedTypePartner,
              name: updatedName,
            });
            setIsEditModalOpen(false);
          }}
          id={selectedTypePartner.id}
          initialName={selectedTypePartner.name}
        />
      )}
    </div>
  );
};

export default TypePartnerPage;

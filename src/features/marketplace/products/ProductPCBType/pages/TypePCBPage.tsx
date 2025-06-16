import TypePCBTable from "../table/TypePCBTable"; // Table component for displaying TypePCBs
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllTypePcbs } from "../hooks/useGetAllTypePCBs"; // Custom hook for fetching all TypePCBs
import { TypePcb } from "@/types/typePcb"; // Type for TypePcb
import { useTypePcbActions } from "../hooks/useTypePCBActions"; // Custom hook for handling edit and delete actions
import { useCreateTypePcb } from "../hooks/useCreateTypePCB";
import CreateTypePCBModal from "../components/CreateTypePCBModal"; // Modal for creating a new TypePCB
import EditTypePCBModal from "../components/EditTypePCBModal"; // Modal for editing a TypePCB

const TypePCBPage = () => {
  // Fetching the list of TypePCBs and managing loading/error state
  const { typePcbs, isLoading, error, refetch } = useGetAllTypePcbs();

  // Handling edit and delete actions for TypePCBs
  const {
    editTypePcb,
    deleteTypePcb,
    isLoading: isActionLoading,
    error: actionError,
  } = useTypePcbActions();

  // Handling the creation of new TypePCBs
  const {
    createTypePcb,
    isLoading: isCreating,
    error: createError,
  } = useCreateTypePcb();

  // Modals for creating and editing TypePCBs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTypePcb, setSelectedTypePcb] = useState<TypePcb | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle editing a TypePCB
  const handleEdit = async (id: string, updatedTypePcb: TypePcb) => {
    try {
      const result = await editTypePcb(id, updatedTypePcb);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing PCB type:", error);
    }
  };

  // Handle deleting a TypePCB
  const handleDelete = async (id: string) => {
    const result = await deleteTypePcb(id);
    if (result) {
      refetch();
    }
  };

  // Open the edit modal with selected TypePCB
  const openEditModal = (typePcb: TypePcb) => {
    setSelectedTypePcb(typePcb);
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
              PCB Types
            </h1>
            <p className="text-sm text-gray-600">Manage your PCB types</p>
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
              title="Add new PCB type"
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
              <span className="hidden sm:inline">Add PCB Type</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <TypePCBTable
            typePcbs={typePcbs}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateTypePCBModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(type) =>
          createTypePcb(type, () => {
            refetch();
            setIsModalOpen(false);
          })
        }
      />

      {isEditModalOpen && selectedTypePcb && (
        <EditTypePCBModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, updatedType) =>
            handleEdit(id, { ...selectedTypePcb, name: updatedType })
          }
          id={selectedTypePcb.id}
          initialName={selectedTypePcb.name}
        />
      )}
    </div>
  );
};

export default TypePCBPage;

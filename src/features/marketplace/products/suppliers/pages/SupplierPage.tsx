import SupplierTable from "../table/SupplierTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllSuppliers } from "../hooks/useGetAllSuppliers";
import { useSupplierActions } from "../hooks/useSupplierActions";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import CreateSupplierModal from "../components/CreateSupplierModal";
import EditSupplierModal from "../components/EditSupplierModal";
import type { Manufacturer } from "../hooks/useGetAllSuppliers";

const SupplierPage = () => {
  const { suppliers, isLoading, error, refetch } = useGetAllSuppliers();

  const {
    editSupplier,
    deleteSupplier,
    isLoading: isActionLoading,
    error: actionError,
  } = useSupplierActions();
  const {
    createSupplier,
    isLoading: isCreating,
    error: createError,
  } = useCreateSupplier();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Manufacturer | null>(
    null,
  );

  const handleEdit = async (
    id: string,
    updatedSupplier: Partial<Manufacturer> & { categories?: string[] },
  ) => {
    try {
      const result = await editSupplier(id, updatedSupplier);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing supplier:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSupplier(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (supplier: Manufacturer) => {
    setSelectedSupplier(supplier);
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
              Suppliers
            </h1>
            <p className="text-sm text-gray-600">Manage your suppliers</p>
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
              title="Add new supplier"
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
              <span className="hidden sm:inline">Add Supplier</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <SupplierTable
            suppliers={suppliers}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateSupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (supplierData) => {
          await createSupplier(
            { ...supplierData, categories: supplierData.categories ?? [] },
            () => {
              refetch();
              setIsModalOpen(false);
            },
          );
        }}
      />

      {isEditModalOpen && selectedSupplier && (
        <EditSupplierModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={async (id, updatedSupplier) => {
            await handleEdit(id, updatedSupplier);
            setIsEditModalOpen(false);
          }}
          initialData={selectedSupplier}
        />
      )}
    </div>
  );
};

export default SupplierPage;

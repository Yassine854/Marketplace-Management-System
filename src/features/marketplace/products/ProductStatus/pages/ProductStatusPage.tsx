import ProductStatusTable from "../table/ProductStatusTable"; // Table component for displaying ProductStatus
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllProductStatuses } from "../hooks/useGetAllProductStatuses"; // Custom hook for fetching all ProductStatuses
import { ProductStatus } from "@/types/productStatus"; // Type for ProductStatus
import { useProductStatusActions } from "../hooks/useProductStatusActions"; // Custom hook for handling edit and delete actions
import { useCreateProductStatus } from "../hooks/useCreateProductStatus";
import CreateProductStatusModal from "../components/CreateProductStatusModal"; // Modal for creating a new ProductStatus
import EditProductStatusModal from "../components/EditProductStatusModal"; // Modal for editing a ProductStatus

const ProductStatusPage = () => {
  // Fetching the list of ProductStatuses and managing loading/error state
  const { productStatuses, isLoading, error, refetch } =
    useGetAllProductStatuses();

  // Handling edit and delete actions for ProductStatuses
  const {
    editProductStatus,
    deleteProductStatus,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductStatusActions();

  // Handling the creation of new ProductStatuses
  const {
    createProductStatus,
    isLoading: isCreating,
    error: createError,
  } = useCreateProductStatus();

  // Modals for creating and editing ProductStatuses
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductStatus, setSelectedProductStatus] =
    useState<ProductStatus | null>(null);

  // Handle editing a ProductStatus
  const handleEdit = async (
    id: string,
    updatedProductStatus: ProductStatus,
  ) => {
    try {
      const result = await editProductStatus(id, updatedProductStatus);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing product status:", error);
    }
  };

  // Handle deleting a ProductStatus
  const handleDelete = async (id: string) => {
    const result = await deleteProductStatus(id);
    if (result) {
      refetch();
    }
  };

  // Open the edit modal with selected ProductStatus
  const openEditModal = (status: ProductStatus) => {
    setSelectedProductStatus(status);
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
              Product Statuses
            </h1>
            <p className="text-sm text-gray-600">
              Manage your product statuses
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
              title="Add new status"
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
              <span className="hidden sm:inline">Add Status</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <ProductStatusTable
            productStatuses={productStatuses}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateProductStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name, actif) =>
          createProductStatus(name, actif, () => {
            refetch();
            setIsModalOpen(false);
          })
        }
      />

      {isEditModalOpen && selectedProductStatus && (
        <EditProductStatusModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, newName, newActif) =>
            handleEdit(id, {
              ...selectedProductStatus,
              name: newName,
              actif: newActif,
            })
          }
          id={selectedProductStatus.id}
          initialName={selectedProductStatus.name}
          initialActif={selectedProductStatus.actif}
        />
      )}
    </div>
  );
};

export default ProductStatusPage;

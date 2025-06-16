import ProductTypeTable from "../table/ProductTypeTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllProductTypes } from "../hooks/useGetAllProductTypes";
import { ProductType } from "@/types/productType";
import { useProductTypeActions } from "../hooks/useProductTypeActions";
import { useCreateProductType } from "../hooks/useCreateProductType";
import CreateProductTypeModal from "../components/CreateProductTypeModal";
import EditProductTypeModal from "../components/EditProductTypeModal";

const ProductTypePage = () => {
  const { productTypes, isLoading, error, refetch } = useGetAllProductTypes();
  const {
    editProductType,
    deleteProductType,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductTypeActions();
  const {
    createProductType,
    isLoading: isCreating,
    error: createError,
  } = useCreateProductType();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);

  const handleEdit = async (id: string, updatedProductType: ProductType) => {
    try {
      const result = await editProductType(id, updatedProductType);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing product type:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProductType(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (productType: ProductType) => {
    setSelectedProductType(productType);
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
              Product Types
            </h1>
            <p className="text-sm text-gray-600">Manage your product types</p>
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
              title="Add new product type"
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
              <span className="hidden sm:inline">Add Product Type</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <ProductTypeTable
            productTypes={productTypes}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateProductTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(type) => {
          createProductType(type, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedProductType && (
        <EditProductTypeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, updatedType) => {
            handleEdit(id, {
              ...selectedProductType,
              type: updatedType,
            });
            setIsEditModalOpen(false);
          }}
          id={selectedProductType.id}
          initialType={selectedProductType.type}
        />
      )}
    </div>
  );
};

export default ProductTypePage;

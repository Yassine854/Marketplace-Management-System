import BrandDataTable from "../table/BrandTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllBrands } from "../hooks/useGetAllBrands";
import { useBrandActions } from "../hooks/useBrandActions";
import { useCreateBrand } from "../hooks/useCreateBrand";
import CreateBrandModal from "../components/CreateBrandModal";
import EditBrandModal from "../components/EditBrandModal";

// Brand interface for typing
interface Brand {
  id: string;
  img: string;
  name: string | null;
}

const BrandPage = () => {
  const { brands, isLoading, error, refetch } = useGetAllBrands();

  const {
    editBrand,
    deleteBrand,
    isLoading: isActionLoading,
    error: actionError,
  } = useBrandActions();
  const {
    createBrand,
    isLoading: isCreating,
    error: createError,
  } = useCreateBrand();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleEdit = async (
    id: string,
    updatedBrand: Partial<Brand> & { image?: File | null },
  ) => {
    try {
      const result = await editBrand(id, updatedBrand);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing brand:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBrand(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
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
              Brands
            </h1>
            <p className="text-sm text-gray-600">Manage your brands</p>
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
              title="Add new brand"
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
              <span className="hidden sm:inline">Add Brand</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <BrandDataTable
            brands={brands}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(brandData) => {
          createBrand(brandData, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedBrand && (
        <EditBrandModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedBrand) => {
            handleEdit(updatedBrand.id, updatedBrand);
            setIsEditModalOpen(false);
          }}
          initialData={selectedBrand}
        />
      )}
    </div>
  );
};

export default BrandPage;

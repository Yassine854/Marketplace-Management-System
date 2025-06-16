import BannerDataTable from "../table/BannerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllBanners } from "../hooks/useGetAllBanners";
import { Banner } from "@/types/banner";
import { useBannerActions } from "../hooks/useBannerActions";
import { useCreateBanner } from "../hooks/useCreateBanner";
import CreateBannerModal from "../components/CreateBannerModal";
import EditBannerModal from "../components/EditBannerModal";

const BannerPage = () => {
  const { banners, isLoading, error, refetch } = useGetAllBanners();

  const {
    editBanner,
    deleteBanner,
    isLoading: isActionLoading,
    error: actionError,
  } = useBannerActions();
  const {
    createBanner,
    isLoading: isCreating,
    error: createError,
  } = useCreateBanner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const handleEdit = async (
    id: string,
    updatedBanner: Partial<Banner> & { image?: File | null },
  ) => {
    try {
      const result = await editBanner(id, updatedBanner);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing banner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBanner(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
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
              Banners
            </h1>
            <p className="text-sm text-gray-600">Manage your banner images</p>
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
              title="Add new banner"
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
              <span className="hidden sm:inline">Add Banner</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <BannerDataTable
            banners={banners}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateBannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(bannerData) => {
          createBanner(bannerData, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedBanner && (
        <EditBannerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedBanner) => {
            handleEdit(updatedBanner.id, updatedBanner);
            setIsEditModalOpen(false);
          }}
          initialData={selectedBanner}
        />
      )}
    </div>
  );
};

export default BannerPage;

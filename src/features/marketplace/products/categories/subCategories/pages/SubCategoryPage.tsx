import { useState, useEffect, useCallback } from "react";
import SubCategoryTable from "../table/SubCategoryTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { SubCategory } from "@/types/subCategory";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import CreateSubCategoryModal from "../components/CreateSubCategoryModal";
import { useCreateSubCategory } from "../hooks/useCreateSubCategory";
import EditSubCategoryModal from "../components/EditSubCategoryModal";

const SubCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const {
    createSubCategory,
    isLoading: isCreating,
    error: createError,
  } = useCreateSubCategory();
  const {
    editSubCategory,
    deleteSubCategory,
    isLoading: isActionLoading,
    error: actionError,
  } = useSubCategoryActions();

  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!categoryId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/marketplace/category/${categoryId}`);
      if (!res.ok) throw new Error("Failed to fetch category");

      const data = await res.json();
      setCategoryName(data.category?.nameCategory || "");
      setSubcategories(data.category?.subCategories || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching category:", err);
      setError("Failed to fetch category data.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("categoryId");
    setCategoryId(id);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSubCategory = async (subCategoryData: {
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => {
    try {
      await createSubCategory(subCategoryData, () => {
        setIsModalOpen(false);
        fetchData();
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  const handleEditSubCategory = async (updatedData: {
    id: string;
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => {
    try {
      const { id, ...updateData } = updatedData;
      await editSubCategory(id, updateData);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubCategory(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const openEditModal = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
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
              Subcategories of {categoryName}
            </h1>
            <p className="text-sm text-gray-600">
              Manage subcategories for this category
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
              title="Add new subcategory"
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
              <span className="hidden sm:inline">Add Subcategory</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <SubCategoryTable
            subcategories={subcategories}
            isLoading={isLoading}
            error={error}
            refetch={fetchData}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateSubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSubCategory}
        categoryId={categoryId}
      />

      {isEditModalOpen && selectedSubcategory && (
        <EditSubCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditSubCategory}
          initialData={selectedSubcategory}
          categoryId={categoryId}
        />
      )}
    </div>
  );
};

export default SubCategoryPage;

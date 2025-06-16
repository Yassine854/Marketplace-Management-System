import CategoryTable from "../table/CategoryTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
import { Category } from "@/types/category";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useCreateCategory } from "../hooks/useCreateCategory";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

const CategoryPage = () => {
  const { categories, isLoading, error, refetch } = useGetAllCategories();

  const {
    editCategory,
    deleteCategory,
    isLoading: isActionLoading,
    error: actionError,
  } = useCategoryActions();
  const {
    createCategory,
    isLoading: isCreating,
    error: createError,
  } = useCreateCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const router = useRouter();

  const handleEdit = async (id: string, updatedCategory: Partial<Category>) => {
    try {
      const result = await editCategory(id, updatedCategory);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleViewSubcategories = (category: Category) => {
    router.push(
      `/marketplace/products/categories/${category.id}?categoryId=${category.id}`,
    );
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
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
              Categories
            </h1>
            <p className="text-sm text-gray-600">
              Manage your product categories
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
              title="Add new category"
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
              <span className="hidden sm:inline">Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onViewSubcategories={handleViewSubcategories}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(categoryData) => {
          createCategory(categoryData, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedCategory) => {
            handleEdit(updatedCategory.id, updatedCategory);
            setIsEditModalOpen(false);
          }}
          initialData={selectedCategory}
        />
      )}
    </div>
  );
};

export default CategoryPage;

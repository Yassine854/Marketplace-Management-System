import { useState } from "react";
import { axios } from "@/libs/axios";
import { Category } from "@/types/category";

export function useCategoryActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editCategory = async (
    id: string,
    updatedCategory: Partial<Category>,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("nameCategory", updatedCategory.nameCategory || "");
      formData.append("isActive", String(updatedCategory.isActive ?? true));

      if (updatedCategory.image) {
        formData.append("image", updatedCategory.image as File);
      }

      const response = await axios.servicesClient.patch(
        `/api/marketplace/category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        return response.data.category;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category");
      console.error("Error updating category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/category/${id}`,
      );
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete category");
      console.error("Error deleting category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editCategory, deleteCategory, isLoading, error };
}

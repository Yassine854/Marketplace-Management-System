import { useState } from "react";
import axios from "axios";

export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (
    categoryData: {
      nameCategory: string;
      isActive?: boolean;
      image?: File | null;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("nameCategory", categoryData.nameCategory);

      if (categoryData.isActive !== undefined) {
        formData.append("isActive", String(categoryData.isActive));
      }

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const response = await axios.post(
        "/api/marketplace/category/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création de la catégorie");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createCategory, isLoading, error };
}

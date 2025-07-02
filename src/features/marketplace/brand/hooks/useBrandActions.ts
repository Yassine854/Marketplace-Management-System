import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";

interface Brand {
  id: string;
  img: string;
  name: string | null;
}

export function useBrandActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editBrand = async (
    id: string,
    updatedBrand: Partial<Brand> & { image?: File | null },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      if (updatedBrand.name !== undefined) {
        formData.append("name", updatedBrand.name || "");
      }
      if (updatedBrand.image) {
        formData.append("image", updatedBrand.image);
      }
      const response = await axios.servicesClient.patch(
        `/api/marketplace/brand/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200) {
        toast.success("Brand updated successfully");
        return response.data.brand;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update brand";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating brand:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrand = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/brand/${id}`,
      );
      if (response.status === 200) {
        toast.success("Brand deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete brand";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting brand:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editBrand, deleteBrand, isLoading, error };
}

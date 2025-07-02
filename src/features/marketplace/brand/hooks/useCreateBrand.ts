import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";

interface Brand {
  id: string;
  img: string;
  name: string | null;
}

export function useCreateBrand() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = async (
    brandData: {
      name: string;
      image: File | null;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!brandData.image) {
        throw new Error("Brand logo image is required");
      }
      if (!brandData.name) {
        throw new Error("Brand name is required");
      }
      const formData = new FormData();
      formData.append("name", brandData.name);
      formData.append("image", brandData.image);
      const response = await axios.servicesClient.post(
        "/api/marketplace/brand/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 201) {
        toast.success("Brand created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create brand";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating brand:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createBrand, isLoading, error };
}

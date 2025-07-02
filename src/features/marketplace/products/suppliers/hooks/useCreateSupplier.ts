import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import type { Manufacturer } from "./useGetAllSuppliers";

export function useCreateSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupplier = async (
    supplierData: Omit<Manufacturer, "id"> & { categories: string[] },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.post(
        "/api/marketplace/supplier/create",
        supplierData,
      );
      if (response.status === 201) {
        toast.success("Supplier created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create supplier";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating supplier:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createSupplier, isLoading, error };
}

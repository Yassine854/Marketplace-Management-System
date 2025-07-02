import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import type { Manufacturer } from "./useGetAllSuppliers";

export function useSupplierActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editSupplier = async (
    id: string,
    updatedSupplier: Partial<Omit<Manufacturer, "id">> & {
      categories?: string[];
    },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/supplier/${id}`,
        updatedSupplier,
      );
      if (response.status === 200) {
        toast.success("Supplier updated successfully");
        return response.data.manufacturer;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update supplier";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating supplier:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/supplier/${id}`,
      );
      if (response.status === 200) {
        toast.success("Supplier deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete supplier";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting supplier:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editSupplier, deleteSupplier, isLoading, error };
}

import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";

interface Tax {
  id: string;
  value: number;
}

export function useTaxActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTax = async (id: string, updatedTax: Partial<Tax>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (updatedTax.value === undefined || isNaN(updatedTax.value as number)) {
        throw new Error("Tax value is required and must be a number");
      }
      const response = await axios.servicesClient.patch(
        `/api/marketplace/tax/${id}`,
        { value: updatedTax.value },
      );
      if (response.status === 200) {
        toast.success("Tax updated successfully");
        return response.data.tax;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update tax";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating tax:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTax = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/tax/${id}`,
      );
      if (response.status === 200) {
        toast.success("Tax deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete tax";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting tax:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editTax, deleteTax, isLoading, error };
}

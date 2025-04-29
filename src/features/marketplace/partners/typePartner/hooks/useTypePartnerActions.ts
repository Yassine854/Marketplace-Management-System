import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface TypePartner {
  id: string;
  name: string;
  partners: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function useTypePartnerActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTypePartner = async (
    id: string,
    updatedTypePartner: TypePartner,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Send only the 'name' field instead of the entire object
      const response = await axios.patch(
        `/api/marketplace/typePartner/${id}`,
        { name: updatedTypePartner.name }, // <-- Key change here
      );
      if (response.status === 200) {
        return response.data.typePartner;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update type partner");
      console.error("Error updating type partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypePartner = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/typePartner/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete type partner";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting type partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editTypePartner, deleteTypePartner, isLoading, error };
}

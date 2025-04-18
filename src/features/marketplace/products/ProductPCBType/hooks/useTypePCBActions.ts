import { useState } from "react";
import axios from "axios";

export interface TypePcb {
  id: string;
  name: string; // name instead of 'type'
  createdAt?: string;
  updatedAt?: string;
}

export function useTypePcbActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTypePcb = async (id: string, updatedTypePcb: Partial<TypePcb>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/type_pcb/${id}`,
        updatedTypePcb,
      );
      if (response.status === 200) {
        return response.data.typePcb;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update PCB type");
      console.error("Error updating PCB type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypePcb = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/type_pcb/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete PCB type");
      console.error("Error deleting PCB type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editTypePcb, deleteTypePcb, isLoading, error };
}

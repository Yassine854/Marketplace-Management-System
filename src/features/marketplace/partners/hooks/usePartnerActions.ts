import { useState } from "react";
import axios from "axios";

export interface Partner {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
  mRoleId: string;
  isActive: boolean;
  logo?: File;
  patent?: File;
  responsibleName: string;
  position: string;
  coverageArea: string;
  minimumAmount: number;
  typePartnerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export function usePartnerActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editPartner = async (id: string, updatedPartner: Partial<Partner>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/partners/${id}`,
        updatedPartner,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200) {
        return response.data.partner;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update partner");
      console.error("Error updating partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/partners/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete partner");
      console.error("Error deleting partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editPartner, deletePartner, isLoading, error };
}

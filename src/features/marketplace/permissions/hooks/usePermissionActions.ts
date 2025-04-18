import { useState } from "react";
import axios from "axios";

export interface Permission {
  id: string;
  resource: string;
  action: string;
  createdAt?: string;
  updatedAt?: string;
}

export function usePermissionActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editPermission = async (
    id: string,
    updatedPermission: Partial<Permission>,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/permissions/${id}`,
        updatedPermission,
      );
      if (response.status === 200) {
        return response.data.permission;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update permission");
      console.error("Error updating permission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePermission = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/permissions/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete permission");
      console.error("Error deleting permission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editPermission, deletePermission, isLoading, error };
}

import { useState } from "react";
import axios from "axios";

export interface Role {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useRoleActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editRole = async (id: string, updatedRole: Partial<Role>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/roles/${id}`,
        updatedRole,
      );
      if (response.status === 200) {
        return response.data.role;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
      console.error("Error updating role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/roles/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete role");
      console.error("Error deleting role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editRole, deleteRole, isLoading, error };
}

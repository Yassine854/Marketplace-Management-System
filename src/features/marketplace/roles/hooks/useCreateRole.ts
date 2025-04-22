import { useState } from "react";
import axios from "axios";

interface CreateRoleData {
  name: string;
}

export function useCreateRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRole = async (data: CreateRoleData, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/roles/create", {
        name: data.name,
      });

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du rôle");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createRole, isLoading, error };
}

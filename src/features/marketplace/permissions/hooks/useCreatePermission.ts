import { useState } from "react";
import axios from "axios";

interface CreatePermissionData {
  resource: string;
}

export function useCreatePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPermission = async (
    data: CreatePermissionData, // Accepting the object here
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/permissions/create", {
        resource: data.resource,
      });

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création de la permission");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createPermission, isLoading, error };
}

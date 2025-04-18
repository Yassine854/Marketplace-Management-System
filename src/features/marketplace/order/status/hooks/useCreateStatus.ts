import { useState } from "react";
import axios from "axios";

export function useCreateStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStatus = async (
    name: string,
    stateId: string,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/status/create", {
        name,
        stateId,
      });
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du statut");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createStatus, isLoading, error };
}

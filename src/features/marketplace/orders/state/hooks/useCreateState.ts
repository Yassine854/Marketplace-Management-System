import { useState } from "react";
import axios from "axios";

export function useCreateState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createState = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/state/create", {
        name,
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

  return { createState, isLoading, error };
}

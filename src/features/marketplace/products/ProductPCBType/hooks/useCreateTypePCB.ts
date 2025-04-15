import { useState } from "react";
import axios from "axios";

export function useCreateTypePcb() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTypePcb = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/type_pcb/create", {
        name,
      });

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du type de PCB");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTypePcb, isLoading, error };
}

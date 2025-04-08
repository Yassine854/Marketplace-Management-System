import { useState } from "react";
import axios from "axios";

export function useCreateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgent = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/agents/create", {
        name,
      });
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création d'agent");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createAgent, isLoading, error };
}

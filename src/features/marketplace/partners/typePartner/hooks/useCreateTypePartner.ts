import { useState } from "react";
import axios from "axios";

export function useCreateTypePartner() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTypePartner = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    if (!name?.trim()) {
      setError("Type partner name is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/marketplace/typePartner/create", {
        name: name.trim(),
      });
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Error while creating the type partner");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTypePartner, isLoading, error };
}

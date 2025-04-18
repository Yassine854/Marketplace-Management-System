import { useState } from "react";
import axios from "axios";

export function useCreateProductStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProductStatus = async (
    name: string,
    actif: boolean,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/product_status/create",
        {
          name,
          actif,
        },
      );

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du statut du produit");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProductStatus, isLoading, error };
}

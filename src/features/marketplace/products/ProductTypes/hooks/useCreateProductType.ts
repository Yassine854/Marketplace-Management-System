import { useState } from "react";
import axios from "axios";

export function useCreateProductType() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProductType = async (type: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/product_type/create",
        {
          type,
        },
      );
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du type de produit");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProductType, isLoading, error };
}

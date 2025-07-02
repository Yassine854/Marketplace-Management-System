import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";

interface Tax {
  id: string;
  value: number;
}

export function useCreateTax() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTax = async (
    taxData: {
      value: number;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof taxData.value !== "number" || isNaN(taxData.value)) {
        throw new Error("Tax value is required and must be a number");
      }
      const response = await axios.servicesClient.post(
        "/api/marketplace/tax/create",
        { value: taxData.value },
      );
      if (response.status === 201) {
        toast.success("Tax created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create tax";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating tax:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTax, isLoading, error };
}

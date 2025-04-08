import { useState } from "react";
import axios from "axios";
import { Customer } from "@/types/customer";

export function useCreateCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (
    customerData: Omit<Customer, "id">,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/customers/create",
        customerData,
      );
      if (response.status === 201) {
        onSuccess?.();
      }
      return response.data; // Return the created customer
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating customer");
      console.error("Error:", err);
      throw err; // Re-throw the error for handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  return { createCustomer, isLoading, error };
}

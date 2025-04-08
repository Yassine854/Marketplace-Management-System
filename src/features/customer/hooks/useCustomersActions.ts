import { useState } from "react";
import axios from "axios";
import { Customer } from "@/typescustomer";

export function useCustomersActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editCustomer = async (id: string, updatedCustomer: Customer) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/customers/${id}`,
        updatedCustomer,
      );
      if (response.status === 200) {
        return response.data.customer;
      }
    } catch (err: any) {
      setError("Failed to update customer");
      console.error("Error updating method:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/customers/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete Customer");
      console.error("Error deleting state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editCustomer, deleteCustomer, isLoading, error };
}

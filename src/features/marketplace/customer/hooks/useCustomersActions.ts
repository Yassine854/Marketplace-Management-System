import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Customer } from "@/types/customer";

export function useCustomersActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editCustomer = async (id: string, formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate required fields from FormData
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const email = formData.get("email");

      if (!firstName || !lastName || !email) {
        throw new Error("Missing required fields");
      }

      const response = await axios.patch(
        `/api/marketplace/customers/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setSuccessMessage("Customer updated successfully!");
        return true;
      } else {
        return false;
      }
    } catch (err: AxiosError | any) {
      console.error("Error editing customer:", err);
      setError(err.response?.data?.error || "Failed to edit customer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.delete(`/api/marketplace/customers/${id}`);
      if (response.status === 200) {
        setSuccessMessage("Customer deleted successfully!");
        return response.data.message;
      }
    } catch (err: AxiosError | any) {
      console.error("Error deleting customer:", err);
      setError(err.response?.data?.error || "Failed to delete customer");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { editCustomer, deleteCustomer, isLoading, error, successMessage };
}

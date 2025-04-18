import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Customer } from "@/types/customer";

export function useCustomersActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editCustomer = async (
    id: string,
    updatedCustomer: Partial<Customer>,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (
        !updatedCustomer.email ||
        !updatedCustomer.firstName ||
        !updatedCustomer.lastName
      ) {
        throw new Error("Missing required fields");
      }

      const formData = new FormData();
      formData.append("firstName", String(updatedCustomer.firstName));
      formData.append("lastName", String(updatedCustomer.lastName));
      formData.append("email", String(updatedCustomer.email));
      if (updatedCustomer.telephone)
        formData.append("telephone", updatedCustomer.telephone);
      if (updatedCustomer.address)
        formData.append("address", String(updatedCustomer.address));
      if (updatedCustomer.governorate)
        formData.append("governorate", String(updatedCustomer.governorate));
      if (updatedCustomer.password?.trim()) {
        formData.append("password", updatedCustomer.password.trim());
      }

      const response = await axios.patch(
        `/api/marketplace/customers/${id}`,
        formData,
      );

      if (response.status === 200) {
        setSuccessMessage("Customer updated successfully!");
        return true; // ✅ Changement ici
      } else {
        return false;
      }
    } catch (err: AxiosError | any) {
      console.error("Error editing customer:", err);
      setError(err.response?.data?.error || "Failed to edit customer");
      return false; // ✅ retourne false en cas d’erreur
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null); // Reset success message before request
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

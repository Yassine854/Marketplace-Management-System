import { useState } from "react";
import axios from "axios";
import { Product } from "@/types/product"; // Assuming you have a Product type
import toast from "react-hot-toast";

export function useProductActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProduct = async (id: string, updatedProduct: Partial<Product>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { id: _, ...updateData } = updatedProduct;

      const response = await axios.patch(
        `/api/marketplace/products/${id}`,
        updateData,
      );

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        return response;
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error creating product");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/products/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating product");
      console.error("Error deleting product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editProduct, deleteProduct, isLoading, error };
}

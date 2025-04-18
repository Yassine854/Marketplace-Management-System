import { useState } from "react";
import axios from "axios";
import { Product } from "@/types/product"; // Assuming you have a Product type

export function useProductActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProduct = async (id: string, updatedProduct: Partial<Product>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { id: _, ...updateData } = updatedProduct;

      const response = await fetch(`/api/marketplace/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.status === 200) {
        return response;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update product");
      console.error("Error updating product:", err);
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
      setError("Failed to delete product");
      console.error("Error deleting product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editProduct, deleteProduct, isLoading, error };
}

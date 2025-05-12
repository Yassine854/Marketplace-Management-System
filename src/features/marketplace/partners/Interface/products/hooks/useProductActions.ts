import { useState } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export function useProductActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const editProduct = async (id: string, updatedProduct: Partial<Product>) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { id: _, ...updateData } = updatedProduct;

      // Convert loyalty points values to numbers
      const numericData = {
        ...updateData,
        loyaltyPointsPerProduct: updateData.loyaltyPointsPerProduct
          ? Number(updateData.loyaltyPointsPerProduct)
          : undefined,
        loyaltyPointsPerUnit: updateData.loyaltyPointsPerUnit
          ? Number(updateData.loyaltyPointsPerUnit)
          : undefined,
        loyaltyPointsBonusQuantity: updateData.loyaltyPointsBonusQuantity
          ? Number(updateData.loyaltyPointsBonusQuantity)
          : undefined,
        loyaltyPointsThresholdQty: updateData.loyaltyPointsThresholdQty
          ? Number(updateData.loyaltyPointsThresholdQty)
          : undefined,
      };

      const response = await axios.patch(
        `/api/marketplace/products/${id}`,
        numericData,
      );

      if (response.status === 200) {
        const successMsg = "Product updated successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error updating product";
      setError(errorMsg);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.delete(`/api/marketplace/products/${id}`);
      if (response.status === 200) {
        const successMsg = "Product deleted successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return response.data.message;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating product");
      console.error("Error deleting product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to delete SKU partner
  const deleteSkuPartner = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // First, find the SKU partner ID for this product and partner
      const skuPartnersResponse = await axios.get(
        "/api/marketplace/sku_partner/getAll",
      );
      const skuPartners = skuPartnersResponse.data.skuPartners;

      // Find the SKU partner that matches both the product ID and partner ID
      const skuPartner = skuPartners.find(
        (sp: any) => sp.productId === productId && sp.partnerId === userId,
      );

      if (!skuPartner) {
        const errorMsg = "SKU partner association not found";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return false;
      }

      // Delete the SKU partner association
      const response = await axios.delete(
        `/api/marketplace/sku_partner/${skuPartner.id}`,
      );

      if (response.status === 200) {
        const successMsg = "Product association removed successfully";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to remove product association";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error removing product association:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { editProduct, deleteProduct, deleteSkuPartner, isLoading, error };
}

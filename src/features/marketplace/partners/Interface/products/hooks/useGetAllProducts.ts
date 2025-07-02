import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Product } from "@/types/product";
import { useSession } from "next-auth/react";

export const useGetAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Get user info from session
  const user = session?.user as
    | {
        id: string;
        roleId?: string;
        mRoleId?: string;
        userType?: string;
      }
    | undefined;

  const isPartner = user?.userType === "partner";
  const partnerId = isPartner ? user.id : null;

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all products
      const { data } = await axios.servicesClient.get<{ products: Product[] }>(
        "/api/marketplace/products/getAll",
      );

      // Filter products to include:
      // 1. Products that have this partner's ID directly (partnerId)
      // 2. Products that are linked through skuPartners relationship
      const filteredProducts = data.products.filter((product) => {
        // Direct relationship - product belongs to this partner
        if (product.partnerId === partnerId) {
          return true;
        }

        // Check if product has skuPartners and any of them belong to this partner
        if (product.skuPartners && product.skuPartners.length > 0) {
          return product.skuPartners.some(
            (skuPartner: any) => skuPartner.partnerId === partnerId,
          );
        }

        return false;
      });

      setProducts(filteredProducts || []);
    } catch (err) {
      let errorMessage = "Failed to fetch products";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) {
      fetchProducts();
    }
  }, [partnerId]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    isEmpty: !isLoading && !error && products.length === 0,
  };
};

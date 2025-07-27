import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export interface UseTotalProductsResult {
  total: number;
  isLoading: boolean;
  isError: boolean;
}

export function useTotalProducts(): UseTotalProductsResult {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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
    setIsError(false);
    try {
      const { data } = await axios.get("/api/marketplace/products/getAll");
      const products = data.products || [];
      // Filter products to include:
      // 1. Products that have this partner's ID directly (partnerId)
      // 2. Products that are linked through skuPartners relationship
      const filteredProducts = products.filter((product: any) => {
        if (product.partnerId === partnerId) {
          return true;
        }
        if (product.skuPartners && product.skuPartners.length > 0) {
          return product.skuPartners.some(
            (skuPartner: any) => skuPartner.partnerId === partnerId,
          );
        }
        return false;
      });
      setTotal(filteredProducts.length);
    } catch (err) {
      setIsError(true);
      setTotal(0);
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
    total,
    isLoading,
    isError,
  };
}

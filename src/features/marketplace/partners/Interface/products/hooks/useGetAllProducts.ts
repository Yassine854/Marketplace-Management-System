import useSWR from "swr";
import { axios } from "@/libs/axios";
import { Product } from "@/types/product";
import { useSession } from "next-auth/react";

export const useGetAllProducts = () => {
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
    if (!partnerId) return [];

    const { data } = await axios.servicesClient.get<{ products: Product[] }>(
      "/api/marketplace/products/getAll",
    );

    // Filter products to include:
    // 1. Products that have this partner's ID directly (partnerId)
    // 2. Products that are linked through skuPartners relationship
    return data.products.filter((product) => {
      if (product.partnerId === partnerId) return true;

      if (product.skuPartners && product.skuPartners.length > 0) {
        return product.skuPartners.some(
          (skuPartner: any) => skuPartner.partnerId === partnerId,
        );
      }

      return false;
    });
  };

  const {
    data: products = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>(
    partnerId ? ["partner-products", partnerId] : null,
    fetchProducts,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    products,
    isLoading,
    error: error ? error.message : null,
    refetch: () => mutate(),
    isEmpty: !isLoading && !error && products.length === 0,
  };
};

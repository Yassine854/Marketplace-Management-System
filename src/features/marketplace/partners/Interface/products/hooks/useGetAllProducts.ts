import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Product } from "@/types/product";
import { useSession } from "next-auth/react";

export const useGetAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First get all SKU partners for this partner
      const skuPartnersResponse = await axios.servicesClient.get(
        "/api/marketplace/sku_partner/getAll",
      );

      // Filter SKU partners to only include those belonging to the current user
      const userSkuPartners = skuPartnersResponse.data.skuPartners.filter(
        (skuPartner: any) => skuPartner.partnerId === userId,
      );

      // Extract product IDs from the filtered SKU partners
      const productIds = userSkuPartners.map(
        (skuPartner: any) => skuPartner.productId,
      );

      // If no products are associated with this partner, return empty array
      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      // Get all products
      const { data } = await axios.servicesClient.get<{ products: Product[] }>(
        "/api/marketplace/products/getAll",
      );

      // Filter products to only include those in the productIds array
      const filteredProducts = data.products.filter((product) =>
        productIds.includes(product.id),
      );

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
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    isEmpty: !isLoading && !error && products.length === 0,
  };
};

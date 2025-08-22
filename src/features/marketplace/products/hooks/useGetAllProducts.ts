import useSWR from "swr";
import { axios } from "@/libs/axios";
import { Product } from "@/types/product";

const fetchProducts = async () => {
  const { data } = await axios.servicesClient.get<{ products: Product[] }>(
    "/api/marketplace/products/getAll",
  );
  return data.products || [];
};

export const useGetAllProducts = () => {
  const {
    data: products = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>("products", fetchProducts, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    products,
    isLoading,
    error: error ? error.message : null,
    refetch: () => mutate(),
    isEmpty: !isLoading && !error && products.length === 0,
  };
};

import { useQuery } from "@tanstack/react-query";
import { magento } from "@/clients/magento";
import { useEffect } from "react";

export const useGetMilkRunOrders = (deliveryDate: number) => {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate.toString()],
    queryFn: async () => {
      const { orders } = await magento.getMilkRunOrdersPerDate(deliveryDate);
      return Array.isArray(orders) ? orders : [];
    },
  });

  useEffect(() => {
    console.log("something went wrong on useGetMilkRunOrders");
  }, [isError]);

  return {
    orders: data || [],
    isError,
    isLoading,
  };
};

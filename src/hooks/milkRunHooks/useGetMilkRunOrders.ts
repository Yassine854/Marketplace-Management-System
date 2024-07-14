import { useQuery } from "@tanstack/react-query";
import { magento } from "@/libs/magento";

export const useGetMilkRunOrders = (deliveryDate: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate.toString()],
    queryFn: async () => {
      const { orders } = await magento.getMilkRunOrdersPerDate(deliveryDate);
      return orders;
    },
  });

  return {
    orders: data,
    isLoading,
  };
};

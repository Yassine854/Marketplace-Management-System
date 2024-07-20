import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetMilkRunOrders = (deliveryDate: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate?.toString()],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/orders/magento/getOrdersByDeliveryDate?deliveryDate=${deliveryDate}`,
      );

      return data;
    },
  });

  return {
    orders: data?.orders || [],
    count: data?.count || 0,
    isLoading,
  };
};

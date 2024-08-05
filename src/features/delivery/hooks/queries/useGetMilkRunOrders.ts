import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetMilkRunOrders = ({ deliveryDate, storeId }: any) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate?.toString()],
    queryFn: async () => {
      if (storeId && deliveryDate) {
        const { data } = await axios.servicesClient(
          `/api/orders/getOrdersByDeliveryDate?deliveryDate=${deliveryDate}&storeId=${storeId}`,
        );

        return data;
      }
    },
  });

  return {
    orders: data?.orders || [],
    count: data?.count || 0,
    isLoading,
    refetch,
  };
};

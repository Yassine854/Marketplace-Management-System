import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useMilkRunStore } from "../../stores/milkRunStore";

export const useGetMilkRunOrders = () => {
  const { deliveryDate } = useMilkRunStore();

  const { storeId } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate],
    queryFn: async () => {
      if (storeId && deliveryDate) {
        const { data } = await axios.servicesClient(
          `/api/delivery/getManyOrdersByDeliveryDate?deliveryDate=${deliveryDate}&storeId=${storeId}`,
        );

        return data || [];
      } else {
        const { data } = await axios.servicesClient(
          `/api/delivery/getManyOrdersByDeliveryDate?deliveryDate=${deliveryDate}`,
        );

        return data || [];
      }
    },

    refetchInterval: 180000,
  });

  return {
    orders: data?.orders || [],
    count: data?.count || 0,
    isLoading,
    refetch,
  };
};

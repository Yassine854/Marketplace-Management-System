import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrdersCount = ({ storeId }: any | undefined) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["useGetOrdersCount", storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/orders/getOrdersCount?storeId=1`,
      );

      return data;
    },
    refetchInterval: 300000,
  });

  return {
    isLoading,
    refetch,
    openOrdersCount: data?.openOrdersCount || 0,
    validOrdersCount: data?.validOrdersCount || 0,
    readyOrdersCount: data?.shippedOrdersCount || 0,
  };
};

import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useGetOrdersCount = ({ storeId }: any | undefined) => {
  const pathname = usePathname();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["useGetOrdersCount", storeId],
    queryFn: async () => {
      const isOnOrdersPage = pathname?.includes("orders");
      if (isOnOrdersPage) {
        const { data } = await axios.servicesClient(
          `/api/orders/getOrdersCount?storeId=1`,
        );

        return data;
      }
    },
    refetchInterval: 180000,
  });

  return {
    isLoading,
    refetch,
    openOrdersCount: data?.openOrdersCount || 0,
    validOrdersCount: data?.validOrdersCount || 0,
    readyOrdersCount: data?.shippedOrdersCount || 0,
  };
};

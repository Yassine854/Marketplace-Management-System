import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const useGetOrder = (id: number) => {
  const pathname = usePathname();
  const { notifications } = useGlobalStore();

  const {
    isLoading,
    data: order,
    refetch,
  } = useQuery({
    queryKey: ["getOrder", id],
    queryFn: async () => {
      const isOnOrderDetailsPage = pathname?.includes("order-details");
      if (isOnOrderDetailsPage) {
        const { data } = await axios.servicesClient(
          `/api/orders/getOrder?id=${id}`,
        );
        return data?.order;
      }
      return null;
    },
    refetchInterval: 180000,
  });

  useEffect(() => {
    if (notifications?.length > 0) {
      refetch();
    }
  }, [notifications, refetch]);

  return {
    order,
    refetch,
    isLoading,
  };
};

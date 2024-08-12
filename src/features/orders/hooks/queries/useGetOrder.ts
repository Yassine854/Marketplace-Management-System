import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useGetOrder = (id: number) => {
  const pathname = usePathname();

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
    },
    refetchInterval: 180000,
  });

  return {
    order,
    refetch,
    isLoading,
  };
};

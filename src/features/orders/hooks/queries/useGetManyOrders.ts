import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useGetManyOrders = ({
  page,
  perPage,
  search,
  sortBy,
  filterBy,
  storeId,
  status,
}: any) => {
  const pathname = usePathname();

  const { isLoading, data, refetch } = useQuery({
    queryKey: [
      "useGetManyOrders",
      page,
      perPage,
      search,
      sortBy,
      storeId,
      status,
    ],
    queryFn: async () => {
      const isOnOrdersPage = pathname?.includes("orders");
      if (isOnOrdersPage) {
        const { data } = await axios.servicesClient(
          `/api/orders/getManyOrders?sortBy=${sortBy}&search=${search}&page=${page}&storeId=${storeId}&status=${status}&perPage=${perPage}`,
        );

        return data;
      }
      return [];
    },
    refetchInterval: 180000,
  });

  return {
    isLoading,
    refetch,
    data,
  };
};

import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useGetManyOrders = ({
  page,
  perPage,
  search,
  sortBy,
  filterBy,
}: any) => {
  const pathname = usePathname();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["useGetManyOrders", page, perPage, search, sortBy, filterBy],
    queryFn: async () => {
      const isOnOrdersPage = pathname?.includes("orders");
      if (isOnOrdersPage) {
        const { data } = await axios.servicesClient(
          `/api/orders/getManyOrders?sortBy=${sortBy}&search=${search}&page=${page}&filterBy=${filterBy}&perPage=${perPage}`,
        );

        return data;
      }
    },
    refetchInterval: 180000,
  });

  return {
    isLoading,
    refetch,
    data,
  };
};

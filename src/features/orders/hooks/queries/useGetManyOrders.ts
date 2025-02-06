import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export const useGetManyOrders = ({
  page,
  perPage,
  search,
  sortBy,
  filterBy,
  storeId,
  status,
  filters,
}: any) => {
  const pathname = usePathname();
  const { notifications } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: [
      "useGetManyOrders",
      page,
      perPage,
      search,
      sortBy,
      storeId,
      status,
      filters,
    ],
    queryFn: async () => {
      const isOnOrdersPage = pathname?.includes("orders");
      if (isOnOrdersPage) {
        const { data } = await axios.servicesClient(
          `/api/orders/getManyOrders?sortBy=${sortBy}&filters=${filters}&search=${search}&page=${page}&storeId=${storeId}&status=${status}&perPage=${perPage}`,
        );

        return data;
      }
      return [];
    },
    refetchInterval: 180000,
  });

  useEffect(() => {
    if (notifications?.length > 0) {
      refetch();
    }
  }, [notifications, refetch]);

  return {
    isLoading,
    refetch,
    data,
  };
};

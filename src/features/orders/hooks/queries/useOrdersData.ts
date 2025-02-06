import { useEffect, useState } from "react";
import { useGetManyOrders } from "./useGetManyOrders";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useFiltersStore} from "@/featuresorders/stores/useFiltersStore"

export const useOrdersData = () => {
  const { status, orders, setOrders, setIsOrdersLoading } = useOrdersStore();

  const { storeId } = useGlobalStore();
  const { filters } = useFiltersStore();
  const { sort, search, currentPage, itemsPerPage } = useOrdersTableStore();

  const { data, isLoading, refetch } = useGetManyOrders({
    page: currentPage || 1,
    perPage: itemsPerPage || 25,
    search,
    sortBy: sort || "createdAt:desc",
    status,
    storeId,
    filters,
  });

  useEffect(() => {
    if (isLoading) {
      setIsOrdersLoading(true);
    }
    setIsOrdersLoading(false);
  }, [isLoading, setIsOrdersLoading]);

  useEffect(() => {
    if (data?.orders?.length) {
      const modifiedOrders = data?.orders?.map((order: any) => ({
        ...order,
        isSelected: false,
      }));
      setOrders(modifiedOrders);
    } else {
      setOrders([]);
    }
  }, [data?.orders, setOrders]);

  return {
    totalOrders: data?.count,
    orders,
    setOrders,
    isLoading,
    selectedStatus: status,
    refetch,
  };
};

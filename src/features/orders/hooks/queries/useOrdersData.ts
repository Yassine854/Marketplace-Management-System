import { useEffect, useState } from "react";
import { useGetManyOrders } from "./useGetManyOrders";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useOrdersData = () => {
  const { status, orders, setOrders, setIsOrdersLoading } = useOrdersStore();

  const { storeId } = useGlobalStore();
  const { sort, search, currentPage, itemsPerPage } = useOrdersTableStore();

  const { data, isLoading, refetch } = useGetManyOrders({
    page: currentPage || 1,
    perPage: itemsPerPage || 25,
    search,
    sortBy: sort || "createdAt:desc",
    status,
    storeId,
  });

  useEffect(() => {
    if (isLoading) {
      setIsOrdersLoading(true);
    }
    setIsOrdersLoading(false);
  }, [isLoading, setIsOrdersLoading]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ data?.orders?.length:", data?.orders?.length);

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

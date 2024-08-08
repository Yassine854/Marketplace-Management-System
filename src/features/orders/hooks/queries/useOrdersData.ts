import { useEffect, useState } from "react";
import { useGetManyOrders } from "./useGetManyOrders";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useOrdersData = () => {
  const { status, orders, setOrders, setIsOrdersLoading } = useOrdersStore();

  const { storeId } = useGlobalStore();
  const { sort, search, currentPage, itemsPerPage } = useOrdersTableStore();

  const [filterBy, setFilterBy] = useState("");

  const { data, isLoading, refetch } = useGetManyOrders({
    page: currentPage || 1,
    perPage: itemsPerPage || 25,
    search,
    sortBy: sort || "createdAt:desc",
    filterBy: filterBy || `storeId:=`,
  });

  useEffect(() => {
    let filterBy = "";

    if (status && storeId) {
      filterBy = `status:=${status} && storeId:=${storeId}`;
    }
    if (status && !storeId) {
      filterBy = `status:=${status}`;
    }
    if (!status && storeId) {
      filterBy = `storeId:=${storeId}`;
    }

    setFilterBy(filterBy);
  }, [status, storeId]);

  useEffect(() => {
    if (isLoading) {
      setIsOrdersLoading(true);
    }
    setIsOrdersLoading(false);
  }, [isLoading, setIsOrdersLoading]);

  useEffect(() => {
    if (data?.orders) {
      const modifiedOrders = data.orders.map((order: any) => ({
        ...order,
        isSelected: false,
      }));
      setOrders(modifiedOrders);
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

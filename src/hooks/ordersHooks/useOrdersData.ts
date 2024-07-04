import { useEffect, useState } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useGetOrders } from "./useGetOrders";

export const useOrdersData = () => {
  const {
    search,
    sort,
    currentPage,
    itemsPerPage,
    status,
    storeId,
    orders,
    setOrders,
    setIsOrdersLoading,
  } = useOrdersStore();

  const [filterBy, setFilterBy] = useState("");

  const { data, isLoading, refetch } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search,
    sortBy: sort,
    filterBy,
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
      const timer = setTimeout(() => {
        setIsOrdersLoading(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsOrdersLoading(false);
  }, [isLoading, setIsOrdersLoading]);

  useEffect(() => {
    if (data?.orders) {
      const modifiedOrders = data.orders.map((order) => ({
        ...order,
        isSelected: false,
      }));
      setOrders(modifiedOrders);
    }
  }, [data?.orders, setOrders]);

  return {
    totalOrders: data?.totalOrders,
    orders,
    setOrders,
    isLoading,
    selectedStatus: status,
    refetch,
  };
};

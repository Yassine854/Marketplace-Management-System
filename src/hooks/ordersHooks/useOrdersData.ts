import { useEffect } from "react";
import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useOrdersStore } from "@/stores/ordersStore";

export const useOrdersData = () => {
  const {
    search,
    sort,
    currentPage,
    itemsPerPage,
    status,
    orders,
    setOrders,
    setIsOrdersLoading,
  } = useOrdersStore();

  const { data, isLoading, refetch } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search,
    sortBy: sort,
    filterBy: status ? `status:=${status}` : "",
  });

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

import { useEffect, useState } from "react";
import { useGetOrders } from "./useGetOrders";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orderManagement/stores/ordersTableStore";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useOrdersData = () => {
  const { status, orders, setOrders, setIsOrdersLoading } = useOrdersStore();

  const { storeId } = useGlobalStore();
  const { sort, search, currentPage, itemsPerPage } = useOrdersTableStore();

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
      setIsOrdersLoading(true);
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

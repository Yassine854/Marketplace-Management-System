import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useOrdersCount } from "./useOrdersCount";
import { useState } from "react";
import { useStatusStore } from "@/stores/status-store";

export const useOrders = () => {
  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();

  //@ts-ignore
  const { status, setStatus } = useStatusStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(`status:=${status}`);

  const { data, isLoading } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search: search,
    sortBy: sort,
    filterBy: "status:=" + status,
  });

  return {
    orders: data?.orders,
    totalOrders: data?.totalOrders,
    isLoading,
    selectedStatus: status,
    setStatus,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
  };
};

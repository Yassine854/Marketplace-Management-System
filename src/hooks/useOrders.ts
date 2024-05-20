import { useEffect, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useOrdersCount } from "./useOrdersCount";

export const useOrders = (status: string) => {
  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, onSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(`status:=${status}`);

  const { data, isLoading } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search: search,
    sortBy: sort,
    filterBy: status ? `status:=${status}` : "",
  });

  return {
    orders: data?.orders,
    totalOrders: data?.totalOrders,
    isLoading,
    selectedStatus: status,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
    setItemsPerPage,
    setCurrentPage,
    setSearch,
    onSort,
  };
};

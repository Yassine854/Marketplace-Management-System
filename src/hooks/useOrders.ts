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
  const [sortBy, setSortBy] = useState({ name: "Total", key: "total" });
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    sortBy: sortBy.key + ":" + sortOrder,
    search: search,
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

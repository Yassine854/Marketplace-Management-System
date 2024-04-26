import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useState } from "react";

type PaginateFunction = (page: number) => void;

export const useOrdersTable = (status: string): any => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data, isLoading } = useGetOrders({
    status: status,
    page: currentPage,
    perPage: itemsPerPage,
  });

  const paginate: PaginateFunction = (page) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const totalPages = Math.ceil(data?.total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data?.total - 1);

  return {
    orders: data?.orders,
    currentPage,
    itemsPerPage,
    totalPages,
    paginate,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    total: data?.totalOrders,
    isLoading,
    setItemsPerPage,
  };
};

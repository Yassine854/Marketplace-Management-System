import { useEffect, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";

type PaginateFunction = (page: number) => void;

export const useOrdersTable = (status: string): any => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);

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

  useEffect(() => {
    const newTotalPages = Math.ceil(data?.totalOrders / itemsPerPage);
    const newStartIndex = (currentPage - 1) * itemsPerPage;
    const newEndIndex = Math.min(
      startIndex + itemsPerPage - 1,
      data?.totalOrders - 1,
    );

    if (data && newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }

    if (data && newStartIndex !== startIndex) {
      setStartIndex(newStartIndex);
    }

    if (data && newEndIndex !== endIndex) {
      setEndIndex(newEndIndex);
    }
  }, [
    data,
    itemsPerPage,
    totalPages,
    currentPage,
    setStartIndex,
    startIndex,
    endIndex,
    setEndIndex,
  ]);

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
    totalOrders: data?.totalOrders,
    isLoading,
    setItemsPerPage: (numberOfItems: number) => {
      const newCurrentPage = Math.ceil(startIndex / numberOfItems);
      setCurrentPage(newCurrentPage + 1);
      setItemsPerPage(numberOfItems);
    },
  };
};

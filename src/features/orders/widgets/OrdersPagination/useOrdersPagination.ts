import { useEffect, useState } from "react";
import { useOrdersData } from "@/features/orders/hooks";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";

export const useOrdersPagination = () => {
  const [endIndex, setEndIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const { totalOrders: totalItems } = useOrdersData();

  const { currentPage, itemsPerPage } = useOrdersTableStore();

  useEffect(() => {
    setEndIndex(Math.min(startIndex + itemsPerPage - 1, totalItems - 1));
  }, [startIndex, itemsPerPage, totalItems, setEndIndex]);

  useEffect(() => {
    setStartIndex((currentPage - 1) * itemsPerPage);
  }, [currentPage, itemsPerPage, setStartIndex]);

  return {
    endIndex,
    totalItems,
    startIndex,
  };
};

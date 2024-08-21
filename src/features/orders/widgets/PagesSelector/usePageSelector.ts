import { useState } from "react";
import { useOrdersData } from "@/features/orders/hooks";
import { usePageSelectorEffects } from "./usePageSelectorEffects";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";
import { useResetPageSelector } from "./useResetPageSelector";

export const usePageSelector = () => {
  const { status } = useOrdersStore();

  const [totalPages, setTotalPages] = useState(0);

  const { totalOrders: totalItems } = useOrdersData();

  const [showedNumbers, setShowedNumbers] = useState<any[]>([]);

  const [pagesList, setPagesList] = useState<any[]>([]);

  const { currentPage, itemsPerPage, setCurrentPage } = useOrdersTableStore();

  const paginate = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useResetPageSelector({ status, setCurrentPage, itemsPerPage });
  usePageSelectorEffects({
    status,
    pagesList,
    totalPages,
    totalItems,
    currentPage,
    setPagesList,
    itemsPerPage,
    setTotalPages,
    showedNumbers,
    setCurrentPage,
    setShowedNumbers,
  });

  return {
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    paginate,
    pagesList,
  };
};

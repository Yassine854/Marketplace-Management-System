import { useEffect } from "react";
import {
  useOrdersData,
  useOrdersSearch,
  useOrdersSorting,
  useOrdersSelection,
  useMultipleOrdersActions,
  useOrdersTablePagination,
  useOrdersCount,
} from "@/features/orderManagement/hooks";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export const useOrdersPage = () => {
  const { status } = useOrdersStore();
  const { orders, totalOrders } = useOrdersData();
  const { setSort, sortRef } = useOrdersSorting();
  const { searchRef, setSearch } = useOrdersSearch();
  const { isSomeOrdersSelected } = useOrdersSelection();

  const { paginationRef, setCurrentPage, setItemsPerPage } =
    useOrdersTablePagination();

  const {
    actions,
    isPending,
    actionsRef,
    cancelOrders,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useMultipleOrdersActions();

  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();

  useEffect(() => {
    if (!isPending || !isCancelingPending) {
      refetch();
      refetchCount();
    }
  }, [isPending, isCancelingPending, refetchCount, refetch]);

  return {
    orders,
    status,
    actions,
    sortRef,
    setSort,
    isPending,
    searchRef,
    setSearch,
    actionsRef,
    totalOrders,
    cancelOrders,
    paginationRef,
    setCurrentPage,
    setItemsPerPage,
    isCancelingPending,
    isCancelingModalOpen,
    isSomeOrdersSelected,
    onCancelingModalClose,
  };
};

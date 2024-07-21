import { useEffect } from "react";
import {
  useOrdersData,
  useOrdersCount,
  useMultipleOrdersActions,
  useOrdersTablePagination,
} from "@/features/orderManagement/hooks";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export const useOrdersPage = () => {
  const { status } = useOrdersStore();

  const { refetch } = useOrdersData();

  const { orders, totalOrders } = useOrdersData();

  const { refetch: refetchCount } = useOrdersCount();

  const { paginationRef, setCurrentPage, setItemsPerPage } =
    useOrdersTablePagination();

  const {
    isPending,
    cancelOrders,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useMultipleOrdersActions();

  useEffect(() => {
    if (!isPending || !isCancelingPending) {
      refetch();
      refetchCount();
    }
  }, [isPending, isCancelingPending, refetchCount, refetch]);

  return {
    orders,
    status,
    totalOrders,
    cancelOrders,
    paginationRef,
    setCurrentPage,
    setItemsPerPage,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  };
};

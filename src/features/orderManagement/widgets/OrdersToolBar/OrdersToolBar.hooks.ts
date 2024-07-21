import {
  useOrdersData,
  useOrdersCount,
  useOrdersSearch,
  useOrdersSorting,
  useOrdersSelection,
  useMultipleOrdersActions,
  useOrdersTablePagination,
} from "@/features/orderManagement/hooks";
import { useEffect, useState } from "react";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export const useOrdersToolbar = () => {
  const { status } = useOrdersStore();

  const { refetch } = useOrdersData();

  const { setSort, sortRef } = useOrdersSorting();

  const { searchRef, setSearch } = useOrdersSearch();

  const { refetch: refetchCount } = useOrdersCount();

  const { isSomeOrdersSelected } = useOrdersSelection();

  const [ordersCount, setOrdersCount] = useState<number>();

  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();

  const {
    actions,
    isPending,
    actionsRef,
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

  useEffect(() => {
    setOrdersCount(0);
    status === "open" && setOrdersCount(openOrdersCount);
    status === "valid" && setOrdersCount(validOrdersCount);
    status === "shipped" && setOrdersCount(openOrdersCount);
  }, [openOrdersCount, validOrdersCount, readyOrdersCount, status]);

  return {
    status,
    actions,
    sortRef,
    setSort,
    isPending,
    searchRef,
    setSearch,
    actionsRef,
    ordersCount,
    isSomeOrdersSelected,
  };
};

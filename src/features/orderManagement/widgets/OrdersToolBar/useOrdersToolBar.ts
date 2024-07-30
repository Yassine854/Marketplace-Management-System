import {
  useOrdersCount,
  useOrdersSearch,
  useOrdersSorting,
  useOrdersSelection,
  useMultipleOrdersActions,
} from "@/features/orderManagement/hooks";
import { useEffect, useState } from "react";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export const useOrdersToolbar = () => {
  const { status } = useOrdersStore();

  const { setSort, sortRef } = useOrdersSorting();

  const { searchRef, setSearch } = useOrdersSearch();

  const { isSomeOrdersSelected } = useOrdersSelection();

  const [ordersCount, setOrdersCount] = useState<number>();

  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();

  const {
    actions,
    isPending,
    actionsRef,
    cancelMultipleOrders,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useMultipleOrdersActions();

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
    isCancelingModalOpen,
    cancelMultipleOrders,
    onCancelingModalClose,
    isSomeOrdersSelected,
    isCancelingPending,
  };
};

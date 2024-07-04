import { useOrdersStore } from "@/stores/ordersStore";
import {
  useOrdersData,
  useOrdersSearch,
  useOrdersSelection,
  useOrdersSorting,
  useMultipleOrdersActions,
  useOrdersTablePagination,
} from "@/hooks/ordersHooks";

export const useOrdersPage = () => {
  const { setSort, sortRef } = useOrdersSorting();

  const { searchRef, setSearch } = useOrdersSearch();

  const { isSomeOrdersSelected } = useOrdersSelection();

  const { orders, totalOrders } = useOrdersData();

  const { status } = useOrdersStore();

  const { paginationRef, setCurrentPage, setItemsPerPage } =
    useOrdersTablePagination();

  const {
    actions,
    isPending,
    isCancelingModalOpen,
    onOpenChange,
    onClose,
    isCancelingPending,
    cancelOrders,
  } = useMultipleOrdersActions();

  return {
    sortRef,
    setSort,
    onOpenChange,
    cancelOrders,
    paginationRef,
    setCurrentPage,
    setItemsPerPage,
    searchRef,
    setSearch,
    isCancelingModalOpen,
    isSomeOrdersSelected,
    orders,
    totalOrders,
    status,
    actions,
    isPending,
    isCancelingPending,
    onClose,
  };
};

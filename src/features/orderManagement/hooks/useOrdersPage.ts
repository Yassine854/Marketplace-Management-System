import {
  useOrdersData,
  useOrdersSearch,
  useOrdersSorting,
  useOrdersSelection,
  useMultipleOrdersActions,
  useOrdersTablePagination,
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

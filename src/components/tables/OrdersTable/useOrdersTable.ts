import {
  useOrdersData,
  useOrdersSelection,
  useOrdersSorting,
  useOrderActions,
} from "@/hooks/ordersHooks";

export const useOrdersTable = () => {
  const { orders, isLoading } = useOrdersData();

  const { changeSelectedSort } = useOrdersSorting();

  const { isAllOrdersSelected, selectAllOrders, selectOrder } =
    useOrdersSelection();

  const {
    onOrderClick,
    orderUnderActionId,
    isCancelingModalOpen,
    onOpenChange,
    cancelOrder,
    isCancelingPending,
    orderToCancelId,
    actions,
    generateSummary,
    pendingOrderId,
  } = useOrderActions();

  return {
    onOrderClick,
    orderUnderActionId,
    isCancelingModalOpen,
    onOpenChange,
    cancelOrder,
    isCancelingPending,
    orderToCancelId,
    actions,
    generateSummary,
    pendingOrderId,
    orders,
    isLoading,
    isAllOrdersSelected,
    selectAllOrders,
    selectOrder,
    changeSelectedSort,
  };
};

import {
  useOrdersData,
  useOrdersSelection,
  useOrdersSorting,
} from "@/features/orderManagement/hooks";

export const useOrdersTable = () => {
  const { orders, isLoading } = useOrdersData();

  const { changeSelectedSort } = useOrdersSorting();

  const { isAllOrdersSelected, selectAllOrders, selectOrder } =
    useOrdersSelection();

  return {
    orders,
    isLoading,
    isAllOrdersSelected,
    selectAllOrders,
    selectOrder,
    changeSelectedSort,
  };
};

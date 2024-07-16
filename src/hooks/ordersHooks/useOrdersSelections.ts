import { useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

type UseOrdersSelection = {
  selectedOrders: string[];
  setSelectedOrders: (selectedOrders: string[]) => void;
  isSomeOrdersSelected: boolean;
  isAllOrdersSelected: boolean;
  selectAllOrders: (isChecked: boolean) => void;
  selectOrder: (isChecked: boolean, orderId: string) => void;
};

export const useOrdersSelection = (): UseOrdersSelection => {
  const {
    status,
    selectOrder,
    itemsPerPage,
    selectedOrders,
    selectAllOrders,
    setSelectedOrders,
    resetSelectedOrders,
    isAllOrdersSelected,
    isSomeOrdersSelected,
    checkIfAllOrdersSelected,
    checkIfSomeOrdersSelected,
    updateOrdersWithSelection,
  } = useOrdersStore();

  useEffect(() => {
    checkIfAllOrdersSelected();
  }, [selectedOrders, itemsPerPage, checkIfAllOrdersSelected]);

  useEffect(() => {
    checkIfSomeOrdersSelected();
  }, [selectedOrders, checkIfSomeOrdersSelected]);

  useEffect(() => {
    resetSelectedOrders();
  }, [status, resetSelectedOrders]);

  useEffect(() => {
    updateOrdersWithSelection();
  }, [selectedOrders, updateOrdersWithSelection]);

  return {
    selectedOrders,
    setSelectedOrders,
    isSomeOrdersSelected,
    isAllOrdersSelected,
    selectAllOrders,
    selectOrder,
  };
};

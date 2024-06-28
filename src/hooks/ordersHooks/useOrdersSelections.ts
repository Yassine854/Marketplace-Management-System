import { useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

interface UseOrdersSelection {
  selectedOrders: string[];
  setSelectedOrders: (selectedOrders: string[]) => void;
  isSomeOrdersSelected: boolean;
  isAllOrdersSelected: boolean;
  onSelectAllClick: (isChecked: boolean) => void;
  onSelectOrderClick: (isChecked: boolean, orderId: string) => void;
}

export const useOrdersSelection = (): UseOrdersSelection => {
  const {
    selectedOrders,
    itemsPerPage,
    status,
    isAllOrdersSelected,
    isSomeOrdersSelected,
    setSelectedOrders,
    selectAllOrders,
    selectOrder,
    checkIfAllOrdersSelected,
    checkIfSomeOrdersSelected,
    resetSelectedOrders,
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
    onSelectAllClick: selectAllOrders,
    onSelectOrderClick: selectOrder,
  };
};

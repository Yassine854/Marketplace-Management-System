import { useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useOrdersTableStore } from "@/stores/ordersTableStore";

type UseOrdersSelection = {
  selectedOrders: string[];
  isAllOrdersSelected: boolean;
  isSomeOrdersSelected: boolean;
  selectAllOrders: (isChecked: boolean) => void;
  setSelectedOrders: (selectedOrders: string[]) => void;
  selectOrder: (isChecked: boolean, orderId: string) => void;
};

export const useOrdersSelection = (): UseOrdersSelection => {
  const { itemsPerPage } = useOrdersTableStore();

  const {
    status,
    selectOrder,
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
    resetSelectedOrders();
  }, [status, resetSelectedOrders]);

  useEffect(() => {
    checkIfSomeOrdersSelected();
  }, [selectedOrders, checkIfSomeOrdersSelected]);

  useEffect(() => {
    updateOrdersWithSelection();
  }, [selectedOrders, updateOrdersWithSelection]);

  useEffect(() => {
    checkIfAllOrdersSelected();
  }, [selectedOrders, itemsPerPage, checkIfAllOrdersSelected]);

  return {
    selectOrder,
    selectedOrders,
    selectAllOrders,
    setSelectedOrders,
    isAllOrdersSelected,
    isSomeOrdersSelected,
  };
};

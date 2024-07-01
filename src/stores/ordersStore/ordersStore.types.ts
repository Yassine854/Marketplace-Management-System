import { Order } from "@/types/order";

export type OrdersStore = {
  orders: Order[];
  selectedOrders: string[];
  itemsPerPage: number;
  status: string;
  isAllOrdersSelected: boolean;
  isSomeOrdersSelected: boolean;
  search: string;
  sort: string;
  currentPage: number;
  isOrdersLoading: boolean;

  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setOrders: (orders: Order[]) => void;
  setSelectedOrders: (selectedOrders: string[]) => void;
  setStatus: (status: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  checkIfAllOrdersSelected: () => void;
  checkIfSomeOrdersSelected: () => void;
  resetSelectedOrders: () => void;
  updateOrdersWithSelection: () => void;
  setIsOrdersLoading: (loading: boolean) => void;
  selectAllOrders: (isChecked: boolean) => void;
  selectOrder: (isChecked: boolean, orderId: string) => void;
};

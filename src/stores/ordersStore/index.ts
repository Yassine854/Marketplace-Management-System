import { create } from "zustand";
import { OrdersStore } from "./ordersStore.types";

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  selectedOrders: [],
  itemsPerPage: 10,
  status: "open",
  storeId: "1",
  isAllOrdersSelected: false,
  isSomeOrdersSelected: false,
  search: "",
  sort: "",
  currentPage: 1,
  isOrdersLoading: false,
  orderOnReviewId: "",
  setOrderOnReviewId: (orderOnReviewId: string) => set({ orderOnReviewId }),
  setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  setSort: (sort: string) => set({ sort }),
  setSearch: (search: string) => set({ search }),
  setIsOrdersLoading: (loading) => set(() => ({ isOrdersLoading: loading })),
  setOrders: (orders) => set({ orders }),
  setSelectedOrders: (selectedOrders) => set({ selectedOrders }),
  setStatus: (status) => set({ status }),
  setStoreId: (storeId) => set({ storeId }),
  checkIfAllOrdersSelected: () => {
    const { selectedOrders, itemsPerPage } = get();
    set({ isAllOrdersSelected: selectedOrders.length === itemsPerPage });
  },
  checkIfSomeOrdersSelected: () => {
    const { selectedOrders } = get();
    set({ isSomeOrdersSelected: selectedOrders.length > 0 });
  },
  resetSelectedOrders: () => set({ selectedOrders: [] }),
  updateOrdersWithSelection: () => {
    const { orders, selectedOrders } = get();
    const updatedOrders = orders.map((order) => ({
      ...order,
      isSelected: selectedOrders.includes(order.id),
    }));
    set({ orders: updatedOrders });
  },
  selectAllOrders: (isChecked) => {
    const { orders, setSelectedOrders } = get();
    isChecked
      ? setSelectedOrders(orders.map((order) => order.id))
      : setSelectedOrders([]);
  },
  selectOrder: (isChecked, orderId) => {
    const { selectedOrders, setSelectedOrders } = get();
    const updatedSelectedOrders = isChecked
      ? [...selectedOrders, orderId]
      : selectedOrders.filter((id) => id !== orderId);
    setSelectedOrders(updatedSelectedOrders);
  },
}));

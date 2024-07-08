import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrdersStore } from "./ordersStore.types";

export const useOrdersStore = create<any>(
  persist(
    (set, get) => ({
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
      orderOnReviewItems: [],
      orderOnReviewItemsBeforeEdit: [],
      orderOnReviewDeliveryDate: null,
      setOrderOnReviewDeliveryDate: (orderOnReviewDeliveryDate: any) =>
        set({ orderOnReviewDeliveryDate }),

      setOrderOnReviewId: (orderOnReviewId: string) => set({ orderOnReviewId }),
      setOrderOnReviewItemsBeforeEdit: (orderOnReviewItemsBeforeEdit: any) =>
        set({ orderOnReviewItemsBeforeEdit }),
      setOrderOnReviewItems: (orderOnReviewItems: any[]) =>
        set({ orderOnReviewItems }),
      setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),
      setCurrentPage: (currentPage: number) => set({ currentPage }),
      setSort: (sort: string) => set({ sort }),
      setSearch: (search: string) => set({ search }),
      setIsOrdersLoading: (loading: boolean) =>
        set(() => ({ isOrdersLoading: loading })),
      setOrders: (orders: any[]) => set({ orders }),
      setSelectedOrders: (selectedOrders: any) => set({ selectedOrders }),
      setStatus: (status: string) => set({ status }),
      setStoreId: (storeId: string) => set({ storeId }),
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
        const updatedOrders = orders.map((order: any) => ({
          ...order,
          isSelected: selectedOrders.includes(order.id),
        }));
        set({ orders: updatedOrders });
      },
      selectAllOrders: (isChecked: boolean) => {
        const { orders, setSelectedOrders } = get();
        isChecked
          ? setSelectedOrders(orders.map((order: any) => order.id))
          : setSelectedOrders([]);
      },
      selectOrder: (isChecked: boolean, orderId: string) => {
        const { selectedOrders, setSelectedOrders } = get();
        const updatedSelectedOrders = isChecked
          ? [...selectedOrders, orderId]
          : selectedOrders.filter((id: string) => id !== orderId);
        setSelectedOrders(updatedSelectedOrders);
      },
    }),
    {
      name: "orders-store", // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

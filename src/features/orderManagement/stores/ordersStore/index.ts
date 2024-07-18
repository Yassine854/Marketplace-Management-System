import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersStore = create<any>(
  persist(
    (set, get) => ({
      orders: [],
      storeId: "1",
      status: "open",
      selectedOrders: [],
      isOrdersLoading: false,
      isAllOrdersSelected: false,
      isSomeOrdersSelected: false,

      setOrders: (orders: any[]) => set({ orders }),
      setStatus: (status: string) => set({ status }),
      setStoreId: (storeId: string) => set({ storeId }),
      resetSelectedOrders: () => set({ selectedOrders: [] }),
      setSelectedOrders: (selectedOrders: any) => set({ selectedOrders }),

      setOrderOnReviewItems: (orderOnReviewItems: any[]) =>
        set({ orderOnReviewItems }),

      setIsOrdersLoading: (loading: boolean) =>
        set(() => ({ isOrdersLoading: loading })),

      checkIfAllOrdersSelected: () => {
        //@ts-ignore
        const { selectedOrders, itemsPerPage } = get();
        set({ isAllOrdersSelected: selectedOrders.length === itemsPerPage });
      },

      checkIfSomeOrdersSelected: () => {
        //@ts-ignore

        const { selectedOrders } = get();
        set({ isSomeOrdersSelected: selectedOrders.length > 0 });
      },

      updateOrdersWithSelection: () => {
        //@ts-ignore

        const { orders, selectedOrders } = get();
        const updatedOrders = orders.map((order: any) => ({
          ...order,
          isSelected: selectedOrders.includes(order.id),
        }));
        set({ orders: updatedOrders });
      },

      selectAllOrders: (isChecked: boolean) => {
        //@ts-ignore
        const { orders, setSelectedOrders } = get();
        isChecked
          ? setSelectedOrders(orders.map((order: any) => order.id))
          : setSelectedOrders([]);
      },

      selectOrder: (isChecked: boolean, orderId: string) => {
        //@ts-ignore
        const { selectedOrders, setSelectedOrders } = get();
        const updatedSelectedOrders = isChecked
          ? [...selectedOrders, orderId]
          : selectedOrders.filter((id: string) => id !== orderId);
        setSelectedOrders(updatedSelectedOrders);
      },
    }),
    {
      name: "ordersStore",
      getStorage: () => localStorage,
    },
  ),
);

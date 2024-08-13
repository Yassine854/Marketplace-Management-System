import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersStore = create<any>(
  persist(
    (set, get) => ({
      orders: [],
      status: "open",
      selectedOrders: [],
      isOrdersLoading: false,
      isAllOrdersSelected: false,
      isSomeOrdersSelected: false,

      reset: () =>
        set({
          status: "open",
          selectedOrders: [],
          isOrdersLoading: false,
          isAllOrdersSelected: false,
          isSomeOrdersSelected: false,
        }),

      setOrders: (orders: any[]) => set({ orders }),
      setStatus: (status: string) => set({ status }),
      resetSelectedOrders: () => set({ selectedOrders: [] }),
      setSelectedOrders: (selectedOrders: any) => set({ selectedOrders }),

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
        if (isChecked) {
          setSelectedOrders(orders.map((order: any) => order.id));
        } else {
          setSelectedOrders([]);
        }
      },

      selectOrder: (isChecked: boolean, orderId: string) => {
        //@ts-ignore
        const { selectedOrders, setSelectedOrders } = get();

        let updatedSelectedOrders = [];
        if (isChecked) {
          updatedSelectedOrders = [...selectedOrders, orderId];
        } else {
          updatedSelectedOrders = selectedOrders.filter(
            (id: string) => id !== orderId,
          );
        }
        //@ts-ignore
        const list = [...new Set(updatedSelectedOrders)];

        setSelectedOrders(list);
      },
    }),
    {
      name: "ordersStore",
      getStorage: () => localStorage,
    },
  ),
);

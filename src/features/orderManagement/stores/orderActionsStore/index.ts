import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderActionsStore = create<any>(
  persist(
    (set, get) => ({
      orderUnderActionId: "",
      setOrderUnderActionId: (orderUnderActionId: string) =>
        set({
          orderUnderActionId,
        }),

      openCancelingModal: () => {},

      isSomeActionPending: false,
      setIsSomeActionPending: (isSomeActionPending: boolean): void =>
        set({ isSomeActionPending }),
      orderToCancelId: "",
      setOrderToCancelId: (orderToCancelId: string) => set({ orderToCancelId }),

      isEditingPending: false,
      setIsEditingPending: (isEditingPending: boolean) =>
        set({ isEditingPending }),

      isPending: false,
      setIsPending: (isPending: boolean) => set({ isPending }),
    }),
    {
      name: "ordersStore",
      getStorage: () => localStorage,
    },
  ),
);

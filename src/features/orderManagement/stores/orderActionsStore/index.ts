import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderActionsStore = create<any>(
  persist(
    (set, get) => ({
      isPending: false,
      selectedAction: {},
      orderToCancelId: "",
      orderUnderActionId: "",
      isEditingPending: false,
      isSomeActionPending: false,

      setOrderUnderActionId: (orderUnderActionId: string) =>
        set({
          orderUnderActionId,
        }),

      setIsEditingPending: (isEditingPending: boolean) =>
        set({ isEditingPending }),

      setIsPending: (isPending: boolean) => set({ isPending }),

      setIsSomeActionPending: (isSomeActionPending: boolean): void =>
        set({ isSomeActionPending }),

      setSelectedAction: (selectedAction: any) => set({ selectedAction }),

      setOrderToCancelId: (orderToCancelId: string) => set({ orderToCancelId }),
    }),
    {
      name: "ordersStore",
      getStorage: () => localStorage,
    },
  ),
);

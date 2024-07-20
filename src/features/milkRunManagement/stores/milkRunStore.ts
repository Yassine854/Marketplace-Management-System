import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUnixTimestampForTomorrow } from "@/utils/unixTimestamp";

export const useMilkRunStore: any = create(
  persist(
    (set) => ({
      deliverySlot: "",
      deliveryAgentId: "",
      selectedOrdersIds: [],
      deliveryAgentName: "",
      deliveryDate: getUnixTimestampForTomorrow(),

      reset: () =>
        set({
          DeliveryAgentId: "",
          selectedOrdersIds: [],
        }),

      setDeliveryAgentName: (deliveryAgentName: string) =>
        set({ deliveryAgentName }),

      setSelectedOrdersIds: (selectedOrdersIds: string[]) =>
        set({ selectedOrdersIds }),

      setDeliverySlot: (deliverySlot: string) => set({ deliverySlot }),
      setDeliveryDate: (deliveryDate: number) => set({ deliveryDate }),
      setDeliveryAgentId: (deliveryAgentId: string) => set({ deliveryAgentId }),
    }),
    {
      name: "milkRunStore",
      getStorage: () => localStorage,
    },
  ),
);

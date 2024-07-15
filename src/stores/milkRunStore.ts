import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUnixTimestampForTomorrow } from "@/utils/unixTimestamp";

export const useMilkRunStore: any = create(
  persist(
    (set) => ({
      selectedOrdersIds: [],
      deliveryDate: getUnixTimestampForTomorrow(),
      deliveryAgentId: "",
      deliveryAgentName: "",
      deliverySlot: "",
      setDeliveryAgentName: (deliveryAgentName: string) =>
        set({ deliveryAgentName }),
      setDeliverySlot: (deliverySlot: string) => set({ deliverySlot }),
      setDeliveryDate: (deliveryDate: number) => set({ deliveryDate }),
      setDeliveryAgentId: (deliveryAgentId: string) => set({ deliveryAgentId }),
      setSelectedOrdersIds: (selectedOrdersIds: string[]) =>
        set({ selectedOrdersIds }),
      reset: () =>
        set({
          selectedOrdersIds: [],
          DeliveryAgentId: "",
        }),
    }),
    {
      name: "milkRunStore",
      getStorage: () => localStorage,
    },
  ),
);

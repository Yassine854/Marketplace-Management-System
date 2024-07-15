import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUnixTimestampForTomorrow } from "@/utils/unixTimestamp";

export const useMilkRunStore: any = create(
  persist(
    (set) => ({
      selectedOrdersIds: [],
      deliveryDate: getUnixTimestampForTomorrow(),
      deliveryAgentId: "",
      milkRun: "",
      setMilkRun: (milkRun: string) => set({ milkRun }),
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

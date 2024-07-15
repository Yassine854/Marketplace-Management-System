import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUnixTimestampForTomorrow } from "@/utils/unixTimestamp";

export const useMilkRunStore: any = create(
  persist(
    (set) => ({
      selectedOrdersIds: [],
      deliveryDate: getUnixTimestampForTomorrow(),
      deliveryAgentId: "",

      setSelectedOrdersIds: (selectedOrdersIds: string[]) =>
        set({ selectedOrdersIds }),
      setDeliveryDate: (deliveryDate: number) => set({ deliveryDate }),
      setDeliveryAgentId: (deliveryAgentId: string) => set({ deliveryAgentId }),
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

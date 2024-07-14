import { create } from "zustand";
import { persist } from "zustand/middleware";

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

function getUnixTimestampForTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1); // Set date to tomorrow
  return Math.floor(tomorrow.getTime() / 1000); // Convert to Unix timestamp (seconds since epoch)
}

export const useMilkRunStore: any = create(
  persist(
    (set, get) => ({
      selectedOrdersIds: [],
      deliveryDate: getUnixTimestampForTomorrow(),
      deliveryAgentId: "",
      setSelectedOrdersIds: (orders: any) => set({ orders }),
      setDeliveryDate: (deliveryDate: any) => set({ deliveryDate }),
      setDeliveryAgentId: (deliveryAgentId: any) => set({ deliveryAgentId }),
    }),
    {
      name: "milkRunStore-store",
      getStorage: () => localStorage,
    },
  ),
);

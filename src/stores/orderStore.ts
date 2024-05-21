import { create } from "zustand";

type OrderState = {
  orderId: string;
  setOrderId: (id: string) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  orderId: "",
  setOrderId: (id) => set(() => ({ orderId: id })),
}));

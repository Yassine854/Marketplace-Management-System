import { create } from "zustand";

export const useStatusStore = create((set) => ({
  status: "open",
  setStatus: (status: any) => set((state: any) => ({ status: status })),
}));

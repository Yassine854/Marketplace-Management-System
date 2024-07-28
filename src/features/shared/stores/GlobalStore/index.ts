import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create<any>(
  persist(
    (set, get) => ({
      storeId: "1",

      setStoreId: (storeId: string) => set({ storeId }),
    }),
    {
      name: "globalStore",
      getStorage: () => localStorage,
    },
  ),
);

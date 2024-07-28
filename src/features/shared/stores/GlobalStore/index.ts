import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create<any>(
  persist(
    (set, get) => ({
      storeId: "1",
      isNoEditUser: false,
      isAdmin: false,

      setStoreId: (storeId: string) => set({ storeId }),
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      setIsNoEditUser: (isNoEditUser: boolean) => set({ isNoEditUser }),
    }),
    {
      name: "globalStore",
      getStorage: () => localStorage,
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create<any>(
  persist(
    (set, get) => ({
      storeId: "1",
      isNoEditUser: false,
      isAdmin: false,
      isMultipleStoreAccessUser: false,

      setStoreId: (storeId: string) => set({ storeId }),
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      setIsMultipleStoreAccessUser: (isMultipleStoreAccessUser: boolean) =>
        set({ isMultipleStoreAccessUser }),
      setIsNoEditUser: (isNoEditUser: boolean) => set({ isNoEditUser }),
    }),
    {
      name: "globalStore",
      getStorage: () => localStorage,
    },
  ),
);

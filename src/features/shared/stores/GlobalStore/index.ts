import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create<any>(
  persist(
    (set, get) => ({
      storeId: "",
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

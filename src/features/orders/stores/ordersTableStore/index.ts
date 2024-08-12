import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersTableStore = create<any>(
  persist(
    (set, get) => ({
      sort: "",
      search: "",
      currentPage: 1,
      itemsPerPage: 10,

      reset: () =>
        set({ sort: "", search: "", currentPage: 1, itemsPerPage: 10 }),

      setSort: (sort: string) => set({ sort }),

      setSearch: (search: string) => set({ search }),
      setCurrentPage: (currentPage: number) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),
    }),
    {
      name: "ordersTableStore",
      getStorage: () => localStorage,
    },
  ),
);

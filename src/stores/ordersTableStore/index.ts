import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersTableStore = create(
  persist(
    (set, get) => ({
      itemsPerPage: 10,
      currentPage: 1,
      search: "",
      sort: "",
      setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage }),
      setCurrentPage: (currentPage: number) => set({ currentPage }),
      setSort: (sort: string) => set({ sort }),
      setSearch: (search: string) => set({ search }),
    }),
    {
      name: "ordersTableStore", // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

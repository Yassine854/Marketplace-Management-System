import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUsersStore: any = create(
  persist(
    (set) => ({
      userOnReviewId: "",
      setUserOnReviewId: (userOnReviewId: string) => set({ userOnReviewId }),
    }),
    {
      name: "usersStore",
      getStorage: () => localStorage,
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderDetailsStore = create<any>(
  persist(
    (set, get) => ({
      orderOnReviewId: "",
      orderOnReviewItems: [],
      orderOnReviewDeliveryDate: null,
      isInEditMode: false,
      total: 0,
      // reset: () => {
      //   const test = get().total;
      // },

      setTotal: (total: number) => set({ total }),

      setOrderOnReviewItems: (orderOnReviewItems: any[]) =>
        set({ orderOnReviewItems }),

      setOrderOnReviewDeliveryDate: (orderOnReviewDeliveryDate: any) =>
        set({ orderOnReviewDeliveryDate }),

      setOrderOnReviewId: (orderOnReviewId: string) => set({ orderOnReviewId }),

      setIsInEditMode: (isInEditMode: boolean) => set({ isInEditMode }),

      setReset: (reset: any) => set({ reset }),
    }),

    {
      name: "orderDetailsStore",
      getStorage: () => localStorage,
    },
  ),
);

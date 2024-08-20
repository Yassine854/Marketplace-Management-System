import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderDetailsStore = create<any>(
  persist(
    (set, get) => ({
      total: 0,
      orderOnReviewId: "",
      isInEditMode: false,
      orderOnReviewItems: [],
      orderOnReviewDeliveryDate: null,

      reset: () =>
        set({
          total: 0,
          isInEditMode: false,
          orderOnReviewId: "",
          orderOnReviewItems: [],
          orderOnReviewDeliveryDate: null,
        }),

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

// stores/purchaseStore.ts
import create from "zustand";

type PurchaseOrderStatus = "IN_PROGRESS" | "READY" | "DELIVERED" | "COMPLETED";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  manufacturer: {
    company_name: string;
  } | null;
  warehouse: {
    name: string;
  } | null;
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  payments: {
    paymentMethod: string;
    amount: number;
  }[];
}

interface PurchaseState {
  purchases: PurchaseOrder[];

  total: number;

  loading: boolean;

  error: string | null;

  fetchPurchases: (
    page: number,

    pageSize: number,

    filters?: Record<string, string>,
  ) => Promise<void>;
}

const usePurchaseStore = create<PurchaseState>((set) => ({
  purchases: [],

  total: 0,

  loading: false,

  error: null,

  fetchPurchases: async (page, pageSize, filters = {}) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),

        pageSize: pageSize.toString(),

        ...filters,
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await fetch(`/api/purchases?${params}`);
      const { data, total } = await response.json();

      set({
        purchases: data.map((order: any) => ({
          ...order,

          manufacturer: order.manufacturer || null,

          warehouse: order.warehouse || null,
        })),

        total,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));

export default usePurchaseStore;

import { create } from "zustand";

type PurchaseOrderStatus = "IN_PROGRESS" | "READY" | "DELIVERED" | "COMPLETED";

interface Product {
  id: string;
  name: string;
  quantity: number;
  priceExclTax: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  manufacturer: {
    id: string;
    companyName: string;
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
  products: Product[];
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
          id: order.id,
          orderNumber: order.orderNumber,
          manufacturer: order.manufacturer
            ? {
                id: order.manufacturer.id,
                companyName: order.manufacturer.companyName,
              }
            : null,
          warehouse: order.warehouse
            ? {
                name: order.warehouse.name,
              }
            : null,
          deliveryDate: new Date(order.deliveryDate),
          totalAmount: order.totalAmount,
          status: order.status,
          payments: order.payments,
          products: order.products || [],
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

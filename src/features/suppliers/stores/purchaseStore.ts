import { create } from "zustand";

type PurchaseOrderStatus = "IN_PROGRESS" | "READY" | "DELIVERED" | "COMPLETED";

interface Product {
  id: string;
  name: string;
  quantity: number;
  priceExclTax: number;
  total: number;
}

interface Payment {
  paymentMethod: string;
  amount: number;
}

interface Supplier {
  id: string;
  companyName: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  manufacturer: Supplier | null;
  manufacturerId: string;
  supplierId: string;
  warehouse: Warehouse | null;
  warehouseId: string;
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  payments: Payment[];
  paymentTypes: { type: string; percentage: number; amount: number }[];
  products: Product[];
  comment: string;
  files: { name: string; url: string }[];
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

          manufacturerId: order.manufacturerId,
          warehouse: order.warehouse
            ? {
                id: order.warehouse.id,
                name: order.warehouse.name,
              }
            : null,
          warehouseId: order.warehouseId,
          deliveryDate: new Date(order.deliveryDate),
          totalAmount: order.totalAmount,
          status: order.status,
          payments: order.payments || [],
          paymentTypes: order.paymentTypes || [],
          products: order.products || [],
          comment: order.comment || "",
          files: order.files || [],
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

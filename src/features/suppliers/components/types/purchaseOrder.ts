export type PurchaseOrderStatus =
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "COMPLETED";

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  manufacturer: {
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
}

export type PurchaseOrderUpdate = Partial<{
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  warehouseId: string;
  manufacturerId: string;
}>;

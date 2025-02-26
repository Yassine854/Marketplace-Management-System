export type PurchaseOrderStatus =
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "COMPLETED";

export interface Product {
  id: string;
  name: string;
  quantity: number;
  priceExclTax: number;
  total: number;
}

export interface PurchaseOrder {
  products: Product[]; // Use the Product interface here
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
  products: Product[]; // Add products to the update type
}>;

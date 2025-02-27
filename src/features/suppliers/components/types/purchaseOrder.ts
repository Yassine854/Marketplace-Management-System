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

export interface Payment {
  paymentMethod: string;
  amount: number;
}

export interface Supplier {
  id: string;
  companyName: string;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface PurchaseOrder {
  products: Product[];
  id: string;
  orderNumber: string;
  supplier: Supplier | null;
  supplierId: string;
  warehouse: Warehouse | null;
  warehouseId: string;
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  payments: Payment[];
  paymentTypes: { type: string; percentage: number; amount: number }[];
  comment: string;
  files: { name: string; url: string }[];
}

export type PurchaseOrderUpdate = Partial<{
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  warehouseId: string;
  supplierId: string;
  products: Product[];
  paymentTypes: { type: string; percentage: number; amount: number }[];
  comment: string;
  files: { name: string; url: string }[];
}>;

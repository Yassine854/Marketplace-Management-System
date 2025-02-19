// Type for Warehouse
export type Warehouse = {
  name: string;
  quantity: number;
};

// Type for Supplier
export type Supplier = {
  manufacturer_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  capital?: string;
  payment_modes: string[];
};

export type Product = {
  id: string;
  productName: string;
  productPrice: number;
  sku: string;
  manufacturer_id: string;
  warehouses: Warehouse[];
};

export interface ProductDetails {
  productName: string;
  quantity: number;
  priceExclTax: number;
  total: number;
}

export interface EmailParams {
  supplier: string;
  warehouse: string;
  state: string;
  products: ProductDetails[];
  totalAmount: string;
  remainingAmount: string;
  comment: string;

  [key: string]: unknown;
}

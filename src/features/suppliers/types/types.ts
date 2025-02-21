export type Warehouse = {
  warehouse_id: any;
  name: string;
  quantity: number;
  products: Product[];
};

export type Supplier = {
  manufacturer_id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  capital?: string;
};

export type Product = {
  id: string;

  product_id: number;

  sku: string;

  name: string;

  price: number;

  website_ids: number[];

  manufacturer: string;
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

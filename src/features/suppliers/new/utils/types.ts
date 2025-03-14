export type Warehouse = {
  warehouse_id: any;
  name: string;
  quantity: number;
  products: Product[];
};

export type Supplier = {
  manufacturer_id: number;
  companyName: string;
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

export interface ProductWithQuantities {
  product: Product;

  quantity: number;

  sku: string;

  id: string;

  priceExclTax: number;

  total: number;
}

export type PaymentType = {
  type: string;

  percentage: string;

  amount: string;

  date: Date;
};

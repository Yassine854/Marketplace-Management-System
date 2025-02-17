// Type for Warehouse
export type Warehouse = {
  name: string; // The name of the warehouse
  quantity: number; // The quantity of products in this warehouse
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
  payment_modes: string[]; // Payment modes available
};

// Type for Product
export type Product = {
  id: string;
  productName: string;
  productPrice: number;
  sku: string;
  manufacturer_id: string;
  warehouses: Warehouse[]; // References Warehouse type
};

// Product Details to be included in the email
export interface ProductDetails {
  productName: string;
  quantity: number;
  priceExclTax: number;
  total: number;
}

// Type for email parameters
// Update the EmailParams type to include an index signature
export interface EmailParams {
  supplier: string;
  warehouse: string;
  state: string;
  products: ProductDetails[];
  totalAmount: string;
  remainingAmount: string;
  comment: string;

  [key: string]: unknown; // This allows for any other dynamic key-value pairs
}

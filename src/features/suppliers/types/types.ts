export type Supplier = {
  manufacturer_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number?: string;
  city?: string;
  payment_modes: string[];
};

export type Product = {
  id: string;
  productName: string;
  productPrice: string;
  sku: string;
  manufacturer_id: string;
};

export type EmailParams = {
  to_name: string;
  from_name: string;
  to_email: string;
  product_name: string;
  quantity: number;
  total_payment: number;
  payment_mode: string;
  delivery_date: string;
};

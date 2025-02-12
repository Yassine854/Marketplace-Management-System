// Correction de Product et Supplier types pour correspondre avec ton JSON

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
  id: string; // Utilise "id" au lieu de "productId" comme tu l'utilises dans ton code.
  productName: string;
  productPrice: number; // Utilise "number" pour un traitement facile des calculs
  sku: string;
  manufacturer_id: string;
  warehouses: {
    name: string;
    quantity: number;
  }[];
};

export type EmailParams = {
  to_name: string;
  from_name: string;
  to_email: string;
  products: string;
  total_payment: number;
  payment_mode: string;
  delivery_date: string;
};

// Type pour Warehouse
export type Warehouse = {
  name: string; // Le nom de l'entrepôt
  quantity: number; // La quantité de produits dans cet entrepôt
};

// Type pour Supplier
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

// Type pour Product
export type Product = {
  id: string;
  productName: string;
  productPrice: number;
  sku: string;
  manufacturer_id: string;
  warehouses: Warehouse[]; // Référence au type Warehouse ici
};

// Type pour les paramètres de l'email
export type EmailParams = {
  to_name: string;
  from_name: string;
  to_email: string;
  products: string;
  total_payment: number;
  payment_mode: string;
  delivery_date: string;
};

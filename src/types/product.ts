export interface Product {
  id: string;
  barcode: string;
  name: string;
  sku: string;
  price: number;
  special_price?: number;
  cost?: number;
  stock?: number;
  description?: string;
  pcb?: string;
  weight?: number;
  minimumQte?: number;
  maximumQte?: number;
  sealable?: number;
  alertQte?: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
  typePcbId?: string;
  productTypeId?: string;
  productStatusId?: string;
  supplierId?: string;
  taxId?: string;
  promotionId?: string;
  partnerId?: string;
  promo: boolean;
  accepted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  brand?: {
    id: string;
    img: string;
    name: string | null;
    productId: string;
  };
  supplier?: {
    id: string;
    companyName: string;
  };
  productStatus?: {
    id: string;
    name: string;
    actif: boolean;
  };
  partner?: {
    id: string;
    username: string;
  };
  productSubCategories?: any[];
  relatedProducts?: any[];
  images?: any[];
  activities: string[];
}

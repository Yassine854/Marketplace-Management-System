export interface ReservationItem {
  id: string;
  qteReserved: number;
  qteCanceled: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  productName?: string;
  taxValue?: number;
}

export interface Reservation {
  id: string;
  amountExclTaxe: number;
  amountTTC: number;
  amountBeforePromo: number;
  amountAfterPromo: number;
  amountRefunded: number;
  amountCanceled: number;
  amountOrdered: number;
  amountShipped: number;
  shippingMethod: string;
  state: boolean;
  loyaltyPtsValue: number;
  fromMobile: boolean;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
  reservationItems: ReservationItem[];
}

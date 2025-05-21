export interface ReservationItem {
  id: string;
  qteReserved: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  productName?: string;
  taxValue?: number;
}
export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
}
export interface OrderPayment {
  id: string;
  name: string;
}
export interface Reservation {
  id: string;
  amountExclTaxe: number;
  amountTTC: number;
  amountBeforePromo: number;
  amountAfterPromo: number;
  amountOrdered: number;
  shippingMethod: string;
  isActive: boolean;
  loyaltyPtsValue: number;
  fromMobile: boolean;
  weight: number;
  customerId: string;
  customer: Customer;

  agentId?: string;
  agent?: Agent;
  paymentMethodId: string;
  paymentMethod: OrderPayment;
  partnerId: string;
  partner: Partner;
  createdAt: Date;
  updatedAt: Date;
  reservationItems: ReservationItem[];
}

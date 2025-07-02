export interface Source {
  id: string;
  name: string;
  partner?: Partner;
}

export interface Partner {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface OrderPayment {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  name: string;
  stateId: string;
}

export interface State {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface Product {
  name: string;
}

export interface OrderItem {
  id: string;
  qteOrdered: number;
  qteRefunded: number;
  qteShipped: number;
  qteCanceled: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  product?: Product;
  source?: Source;
}

export interface Order {
  id: string;
  amountTTC: number;
  amountRefunded: number;
  amountCanceled: number;
  amountOrdered: number;
  amountShipped: number;
  shippingMethod: string;
  shippingAmount: number;
  loyaltyPtsValue: number;
  fromMobile: boolean;
  weight: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  statusId: string;
  status?: Status;
  isActive: boolean;
  stateId: string;
  state?: State;
  customerId: string;
  customer?: Customer;
  agentId?: string;
  agent?: Agent;
  orderItems: OrderItem[];
  paymentMethodId: string;
  paymentMethod?: OrderPayment;
}

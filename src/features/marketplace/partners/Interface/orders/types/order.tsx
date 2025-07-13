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
  telephone?: string;
  address?: string;
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
  orderId?: string;
  productId?: string;
  sourceId?: string;
  partnerId?: string;
  stateId?: string;
  statusId?: string;
  agentId?: string | null;
  product?: Product;
  state?: State;
  status?: Status;
  source?: Source;
}

export interface VendorOrder {
  id: string;
  orderCode: string;
  total: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  status?: Status | null;
  state?: State | null;
  partner: Partner;
  order: {
    id: string;
    // Add more fields as needed from the related Order if you use them
  };
  orderAgent?: Agent | null;
  itemsSnapshot?: any;
}

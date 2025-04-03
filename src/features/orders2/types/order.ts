import {
  Order as PrismaOrder,
  Status,
  State,
  Customer,
  Agent,
  Reservation,
  Partner,
  OrderItem,
  LoyaltyPoints,
  OrderPayment,
  ReservationItem,
  Product,
  Tax,
} from "@prisma/client";

export type OrderItemWithRelations = OrderItem & {
  id: string;
  qteOrdered: number;
  qteRefunded: number;
  qteShipped: number;
  qteCanceled: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  orderId: string;
};

export type OrderWithRelations = PrismaOrder & {
  amountExclTaxe: number;
  amountTTC: number;
  amountBeforePromo: number;
  amountAfterPromo: number;
  amountRefunded: number;
  amountCanceled: number;
  amountOrdered: number;
  amountShipped: number;
  shippingMethod: string;
  loyaltyPtsValue: number;
  isActive: boolean;
  fromMobile: boolean;
  weight: number;
  createdAt: Date;
  updatedAt: Date;

  status: Status;
  state: State;
  customer: Customer;
  agent?: Agent;
  reservation?: Reservation & {
    agent?: Agent;
    partner: Partner;
    customer: Customer;
    paymentMethod: OrderPayment;
    reservationItems: (ReservationItem & {
      product: Product & {
        name: string;
      };
      tax: Tax & {
        value: number;
      };
    })[];
  };
  partner: Partner;
  orderItems: OrderItemWithRelations[];
  loyaltyPoints: LoyaltyPoints[];
  paymentMethod: OrderPayment;
};

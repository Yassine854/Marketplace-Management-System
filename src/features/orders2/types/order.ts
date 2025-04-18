import {
  Order as PrismaOrder,
  Status,
  State,
  Customers,
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

  status?: Status | null;
  state?: State | null;
  customer?: Customers | null;
  agent?: Agent | null;
  reservation?: Reservation & {
    agent?: Agent | null;
    partner?: Partner | null;
    customer?: Customers | null;
    paymentMethod: OrderPayment | null;
    reservationItems: (ReservationItem & {
      product: Product & {
        name: string;
      };
      tax: Tax & {
        value: number;
      };
    })[];
  };
  partner?: Partner | null;
  orderItems: OrderItemWithRelations[];
  loyaltyPoints: LoyaltyPoints[];
  paymentMethod: OrderPayment | null;
  paymentMethodId: string | null;
};

import { Order } from "@/types/order";

export type Props = {
  order: Order;
  onClick: (id: string) => void;
};

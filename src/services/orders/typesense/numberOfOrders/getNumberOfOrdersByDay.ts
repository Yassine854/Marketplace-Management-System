import { typesense } from "@/clients/typesense";

export const getNumberOfOrdersByDay = (
  isoDate: string,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byDay(isoDate);

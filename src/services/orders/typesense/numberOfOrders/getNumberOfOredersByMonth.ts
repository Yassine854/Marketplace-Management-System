import { typesense } from "@/clients/typesense";

export const getNumberOfOrdersByMonth = (
  isoDate: string,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byMonth(isoDate);

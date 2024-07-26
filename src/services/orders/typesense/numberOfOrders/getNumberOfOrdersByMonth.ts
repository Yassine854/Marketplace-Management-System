import { typesense } from "@/clients/typesense";

export const getNumberOfOrdersByMonth = (
  year: number,
  month: number,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byMonth(year, month);

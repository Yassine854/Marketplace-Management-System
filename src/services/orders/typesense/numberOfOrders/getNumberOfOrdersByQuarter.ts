import { typesense } from "@/clients/typesense";

export const getNumberOfOrdersByQuarter = (
  yearArg: number,
  quarter: string,
): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byQuarter(yearArg, quarter);

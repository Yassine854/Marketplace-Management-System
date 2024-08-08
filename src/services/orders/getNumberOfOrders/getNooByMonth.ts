import { typesense } from "@/clients/typesense";

export const getNooByMonth = (isoDate: string): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byMonth(isoDate);

import { typesense } from "@/clients/typesense";

export const getNooByDay = (isoDate: string): Promise<number | undefined> =>
  typesense.orders.numberOfOrders.byDay(isoDate);

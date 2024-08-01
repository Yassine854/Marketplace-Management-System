import { typesense } from "@/clients/typesense";

export const getgmvByDay = (
  yearArg: number,
  monthArg: number,
  dayArg: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byDay(yearArg, monthArg, dayArg);

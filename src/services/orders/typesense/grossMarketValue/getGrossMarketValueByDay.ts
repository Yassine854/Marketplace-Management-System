import { typesense } from "@/clients/typesense";

export const getGrossMarketValueByDay = (
  yearArg: number,
  month: number,
  dayArg: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byDay(yearArg, month, dayArg);

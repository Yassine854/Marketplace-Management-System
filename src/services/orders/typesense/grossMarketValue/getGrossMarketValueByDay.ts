import { typesense } from "@/clients/typesense";

export const getGrossMarketValueByDay = (
  yearArg: any,
  month: number,
  dayArg: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byDay(yearArg, month, dayArg);

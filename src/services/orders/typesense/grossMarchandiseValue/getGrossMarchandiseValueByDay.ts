import { typesense } from "@/clients/typesense";

export const getGrossMarketValueByDay = (
  yearArg: number,
  monthArg: number,
  dayArg: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byDay(yearArg, monthArg, dayArg);

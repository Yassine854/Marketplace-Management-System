import { typesense } from "@/clients/typesense";

export const getGrossMarketValueByMonth = (
  yearArg: number,
  month: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byMonth(yearArg, month);

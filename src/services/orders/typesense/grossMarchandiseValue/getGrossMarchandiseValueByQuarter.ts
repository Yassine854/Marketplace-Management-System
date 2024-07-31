import { typesense } from "@/clients/typesense";

export const getGrossMarketValueByQuarter = (
  yearArg: number,
  quarter: string,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byQuarter(yearArg, quarter);

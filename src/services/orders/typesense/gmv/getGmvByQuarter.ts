import { typesense } from "@/clients/typesense";

export const getgmvByQuarter = (
  yearArg: number,
  quarter: string,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byQuarter(yearArg, quarter);

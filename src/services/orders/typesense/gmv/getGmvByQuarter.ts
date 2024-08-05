import { typesense } from "@/clients/typesense";

export const getGmvByQuarter = (
  yearArg: number,
  quarter: string,
): Promise<number | undefined> =>
  typesense.orders.gmv.byQuarter(yearArg, quarter);

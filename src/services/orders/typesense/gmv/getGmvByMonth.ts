import { typesense } from "@/clients/typesense";
export const getgmvByMonth = (
  yearArg: number,
  monthArg: number,
): Promise<number | undefined> =>
  typesense.orders.grossMarketValue.byMonth(yearArg, monthArg);

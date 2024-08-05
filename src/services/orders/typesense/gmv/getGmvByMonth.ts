import { typesense } from "@/clients/typesense";
export const getgmvByMonth = (
  yearArg: number,
  monthArg: number,
): Promise<number | undefined> =>
  typesense.orders.gmv.byMonth(yearArg, monthArg);

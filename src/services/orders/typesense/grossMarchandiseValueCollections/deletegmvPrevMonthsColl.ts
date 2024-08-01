import { typesenseClient } from "@/clients/typesense/typesenseClient";

export const deletegmvCollection = async (): Promise<any> =>
  typesenseClient.collections("gmvPreviousMonths").delete();

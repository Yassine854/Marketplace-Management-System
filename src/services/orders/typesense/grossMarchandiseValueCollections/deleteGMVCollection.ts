import { typesenseClient } from "@/clients/typesense/typesenseClient";

export const deleteGMVCollection = async (
  collectionName: string,
): Promise<any> => {
  typesenseClient.collections(collectionName).delete();
};

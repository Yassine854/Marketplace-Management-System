import { typesenseClient } from "@/clients/typesense/typesenseClient";

export const deleteCollection = async (
  collectionName: string,
): Promise<any> => {
  typesenseClient.collections(collectionName).delete();
};

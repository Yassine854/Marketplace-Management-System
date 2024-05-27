import { typesenseClient } from "@/libs/typesense";

export const isCollectionExist = async (collectionName: string) => {
  try {
    await typesenseClient.collections(collectionName).retrieve();
    return true;
  } catch {
    return false;
  }
};

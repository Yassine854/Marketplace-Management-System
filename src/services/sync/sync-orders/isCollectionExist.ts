import { typesenseClient } from "@/libs/typesenseClient";

export const isCollectionExist = async (collectionName: string) => {
  try {
    await typesenseClient.collections(collectionName).retrieve();
    return true;
  } catch {
    return false;
  }
};

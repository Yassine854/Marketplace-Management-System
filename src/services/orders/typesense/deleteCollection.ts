import { typesenseClient } from "@/clients/typesense/typesenseClient";

export const deleteCollection = async (
  collectionName: string,
): Promise<any> => {
  try {
    const collections = await typesenseClient.collections().retrieve();
    const collectionExists = collections.some(
      (collection: any) => collection.name === collectionName,
    );

    if (!collectionExists) {
      throw new Error(`Collection "${collectionName}" does not exist.`);
    }

    await typesenseClient.collections(collectionName).delete();
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while deleting the collection.",
    );
  }
};

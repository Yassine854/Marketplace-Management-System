import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const createCollection = async (
  collection: CollectionCreateSchema,
): Promise<{ success: boolean; message?: string }> => {
  try {
    await typesenseClient.collections().create(collection);
    return { success: true };
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return { success: false, message: "conflict" };
    }

    if (message.includes("Request failed with HTTP code 400")) {
      return { success: false, message: message };
    }

    return { success: false, message: "internal_server_error" };
  }
};

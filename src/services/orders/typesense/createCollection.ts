import { NextRequest, NextResponse } from "next/server";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { logError } from "@/utils/logError";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
} from "./grossMarchandiseValueCollections/response";

export const createCollection = async (
  request: NextRequest,
  collection: CollectionCreateSchema,
) => {
  try {
    await typesenseClient.collections().create(collection);
    return successResponse("");
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return conflictResponse();
    }

    if (message.includes("Request failed with HTTP code 400"))
      return invalidRequestResponse(message);
  }

  return internalServerErrorResponse();
};

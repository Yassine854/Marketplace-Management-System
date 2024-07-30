import { NextRequest, NextResponse } from "next/server";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { logError } from "@/utils/logError";

import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/gmvPreviousMonthsCollection";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
} from "./response";
export const addgmvCollection = async (request: NextRequest) => {
  try {
    await typesenseClient
      .collections()
      .create(gmvPreviousMonthsCollectionSchema);

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

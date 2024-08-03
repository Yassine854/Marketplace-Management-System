import { createCollection } from "@/services/orders/typesense/createCollection";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/gmvPreviousMonthsCollection";

import { NextRequest, NextResponse } from "next/server";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
} from "src/utils/responses/typesenseResponses/CollectionHandlingResponse";

export const GET = async (request: NextRequest) => {
  const result: any = await createCollection(gmvPreviousMonthsCollectionSchema);

  if (result.success) {
    return successResponse(
      gmvPreviousMonthsCollectionSchema.name + " created successfully.",
    );
  }

  switch (result.message) {
    case "conflict":
      return conflictResponse();
    case "internal_server_error":
      return internalServerErrorResponse();
    default:
      return invalidRequestResponse(result.message);
  }
};

import type { NextRequest } from "next/server";
import { typesenseClient } from "@/libs/typesense";
import { isAuthorized } from "@/services/auth/isAuthorized";
import { logError } from "@/utils/logError";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
  UnauthorizedErrorResponse,
} from "./errorResponses";

export const addOrder = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    UnauthorizedErrorResponse();
  }

  try {
    const { order } = await request.json();

    await typesenseClient.collections("orders").documents().create(order);

    return successResponse(order.id);
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return conflictResponse();
    }

    if (message.includes("Request failed with HTTP code 400"))
      return invalidRequestResponse(message);
  }

  internalServerErrorResponse();
};

import type { NextRequest } from "next/server";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { logError } from "@/utils/logError";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
  unauthorizedErrorResponse,
} from "./errorResponses";

export const addOrder = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return unauthorizedErrorResponse();
    }

    const { order } = await request.json();

    await typesense.orders.addOne(order);

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

  return internalServerErrorResponse();
};

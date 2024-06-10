import type { NextRequest } from "next/server";
import { typesenseClient } from "@/libs/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { logError } from "@/utils/logError";
import {
  successResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
  unauthorizedErrorResponse,
  notFoundResponse,
} from "./errorResponses";

export const editOrder = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return unauthorizedErrorResponse();
    }

    const { order } = await request.json();

    await typesenseClient
      .collections("orders")
      .documents(order.id)
      .update(order);

    return successResponse(order.id);
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 404"))
      return notFoundResponse(message);

    if (message.includes("Request failed with HTTP code 400"))
      return invalidRequestResponse(message);

    return internalServerErrorResponse();
  }
};

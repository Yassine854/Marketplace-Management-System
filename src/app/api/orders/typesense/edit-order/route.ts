import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const { order } = await request.json();

    await typesense.orders.updateOne(order);

    NextResponse.json(
      {
        message: "Order successfully updated.",
        orderId: order?.id,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 404")) {
      const parts = message.split("with id:");

      const id = parts[1].trim();

      return NextResponse.json(
        {
          error: "Order not found.",
          orderId: id,
        },
        {
          status: 404,
        },
      );
    }

    if (message.includes("Request failed with HTTP code 400")) {
      const parts = message.split("Server said:");

      const serverSaidPart = parts[1].trim();

      return responses.invalidRequest(serverSaidPart);
    }

    return responses.internalServerError(error);
  }
};

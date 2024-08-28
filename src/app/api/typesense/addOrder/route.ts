import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";

function findMissingProperties(order: any) {
  const requiredProperties = [
    "id",
    "orderId",
    "incrementId",
    "kamiounId",
    "state",
    "status",
    "total",
    "createdAt",
    "customerId",
    "storeId",
    "customerFirstname",
    "customerLastname",
  ];

  const missingProperties = requiredProperties.filter((prop) => {
    return !order.hasOwnProperty(prop);
  });

  return missingProperties;
}

const webSocketApiUrl = process.env.WEBSOCKET_API_URL;

export const POST = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const { order } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (order) {
      const missing = findMissingProperties(order);

      if (missing?.length) {
        return responses.invalidRequest(
          "those properties are missing :" + "[" + missing + "]",
        );
      }
    }
    const unixTimestamp = Math.floor(Date.now() / 1000);

    await typesense.orders.addOne({
      ...order,
      deliveryDate:
        convertIsoDateToUnixTimestamp(order?.deliveryDate) || unixTimestamp,
      createdAt:
        convertIsoDateToUnixTimestamp(order?.createdAt) || unixTimestamp,
      updatedAt: unixTimestamp,
      productsNames: getOrderProductsNames(order?.items),
    });

    order["action"] = "Created";

    await fetch(`${webSocketApiUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }).catch((error) => {
      console.error("Error creating order:", error);
    });

    return NextResponse.json(
      {
        message: "Order successfully added.",
        orderId: order?.id,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return NextResponse.json(
        {
          error: "Order already exists.",
        },
        {
          status: 409,
        },
      );
    }

    if (message.includes("Request failed with HTTP code 400"))
      return responses.invalidRequest(message);

    return responses.internalServerError(error);
  }
};

import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";

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

    await typesense.orders.addOne({
      ...order,
      productsNames: getOrderProductsNames(order?.items),
    });

    order["action"] = "Created";

    await fetch("http://localhost:4001/api", {
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

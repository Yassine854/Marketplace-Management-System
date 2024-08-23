import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { prisma } from "@/clients/prisma";
import { createMilkRunAuditLog } from "@/services/auditing/milkRun";

export const PUT = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }
    const { order, username } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    await typesense.orders.updateOne({
      ...order,
      productsNames: getOrderProductsNames(order?.items),
    });

    const user = await prisma.getUser(username);

    await createMilkRunAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} edit order`,
      actionTime: new Date(),
      orderId: order.orderId,
      storeId: order?.storeId,
      agentId: order.deliveryAgentId,
      agentName: order.deliveryAgentName,
      deliveryDate: order.deliveryDate.toString(),
    });

    return NextResponse.json(
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

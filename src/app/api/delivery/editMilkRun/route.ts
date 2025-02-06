import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/clients/prisma";
import { createMilkRunAuditLog } from "@/services/auditing/milkRun";
import { magento } from "@/clients/magento";

export const PUT = async (request: NextRequest) => {
  try {
    const { order, username } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (!order?.id) {
      return responses.invalidRequest("id is Required");
    }

    if (!order?.deliverySlot) {
      return responses.invalidRequest("deliverySlot is Required");
    }

    if (!order?.deliveryAgentId) {
      return responses.invalidRequest("deliveryAgentId  is Required");
    }

    if (!order?.deliveryAgentName) {
      return responses.invalidRequest("deliveryAgentName  is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    const sorder: any = await typesense.orders.getOne(order.id);
    await magento.mutations.editOrderMilkRun({
      orderId: order?.id,
      deliverySlot: order?.deliverySlot,
      deliveryAgentName: order?.deliveryAgentName,
      deliveryAgentId: order?.deliveryAgentId,
      status:sorder?.status,
      state:sorder?.state, 
      
    });

    await typesense.orders.updateOne(order);

    const user = await prisma.getUser(username);

    await createMilkRunAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} edit order`,
      actionTime: new Date(),
      orderId: order?.id,
      storeId: "0",
      agentId: order?.deliveryAgentId,
      agentName: order?.deliveryAgentName,
      deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : 'N/A',
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

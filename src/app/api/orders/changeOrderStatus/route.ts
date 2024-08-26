import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createAuditLog } from "@/services/auditing/orders";
import { getOrder } from "@/services/orders/getOrder";
export const POST = async (request: NextRequest) => {
  try {
    const { orderId, status, state, username } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }
    if (!status) {
      return responses.invalidRequest("status is Required");
    }

    if (!state) {
      return responses.invalidRequest("state is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    await magento.mutations.changeOrderStatus({ orderId, status, state });

    await typesense.orders.updateOne({
      id: orderId,
      status,
      state,
    });
    const order = await getOrder(orderId);
    const user = await prisma.getUser(username);
    if (!user) {
      return responses.invalidRequest("User not found");
    }

    await createAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} changed order status to ${status}`,
      actionTime: new Date(),
      orderId: orderId,
      storeId: order?.storeId,
    });

    return NextResponse.json(
      {
        message: "Order Status Changed  Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

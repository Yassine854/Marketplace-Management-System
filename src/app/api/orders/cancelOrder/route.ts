import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/services/auditing";
import { prisma } from "@/clients/prisma";
import { getOrder } from "@/services/orders/getOrder";
export const POST = async (request: NextRequest) => {
  try {
    const { orderId, username } = await request.json();
    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    await magento.mutations.cancelOrder(orderId);
    await typesense.orders.cancelOne(orderId);

    const user = await prisma.getUser(username);
    const order = await getOrder(orderId);

    await createAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} canceled order`,
      actionTime: new Date(),
      orderId: orderId,
      storeId: order?.storeId,
    });

    return NextResponse.json(
      { message: "Order Canceled Successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

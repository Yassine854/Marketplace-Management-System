import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createAuditLog } from "@/services/auditing/orders";
import { getOrder } from "@/services/orders/getOrder";
export const PUT = async (request: NextRequest) => {
  try {
    const { order, username } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    const { total, orderId, items, deliveryDate } = order;

    await magento.mutations.editOrderDetails({
      total,
      items,
      orderId,
      deliveryDate,
    });

    await typesense.orders.updateOne({
      total,
      items,
      orderId,
      deliveryDate,
    });

    const orderObject = await getOrder(orderId);
    const user = await prisma.getUser(username);
    await createAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} edit order`,
      actionTime: new Date(),
      orderId: orderId,
      storeId: orderObject?.storeId,
    });
    return NextResponse.json(
      {
        message: "Order Edited Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

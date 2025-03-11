import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createAuditLog } from "@/services/auditing/orders";
import { getOrder } from "@/services/orders/getOrder";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";

import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";
import { orderStatus } from "@/features/shared/elements/SidebarElements/SidebarOrdersSubMenu/orderStatus";

export const PUT = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };

  try {
    const { order, username } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (!order?.orderId) {
      return responses.invalidRequest("orderId is Required");
    }

    if (!order?.items) {
      return responses.invalidRequest("Items is Required");
    }

    if (!order?.deliveryDate) {
      return responses.invalidRequest("deliveryDate is Required");
    }

    if (!order?.total) {
      return responses.invalidRequest("total is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    const { total, orderId, items, deliveryDate } = order;
    const orderBefore = await getOrder(orderId);
    const storeId = orderBefore.storeId;

    const res = await magento.mutations.editOrderDetails({
      total,
      items,
      orderId,
      deliveryDate,
    });

    await typesense.orders.updateOne({
      total,
      items,
      id: orderId,
      deliveryDate: convertIsoDateToUnixTimestamp(deliveryDate),
    });

    const orderAfter = await getOrder(orderId);
    const user = await prisma.getUser(username);

    /* await createAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} edit order`,
      actionTime: new Date(),
      orderId: orderId,
      storeId: orderObject?.storeId,
    });*/
    await createLog({
      type: "Order",
      message: `Order edited `,
      context: JSON.stringify({
        userId: user?.id,
        username: user?.username,
        storeId: storeId,
      }),
      timestamp: new Date(),
      dataBefore: JSON.stringify({
        orderId: orderBefore.orderId,
        deliveryDate: orderBefore.deliveryDate,
        total: orderBefore.total,

        status: orderBefore.status,
      }),
      dataAfter: JSON.stringify({
        orderId: orderAfter.orderId,
        deliveryDate: orderAfter.deliveryDate,
        total: orderAfter.total,

        status: orderAfter.status,
      }),
      id: "",
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

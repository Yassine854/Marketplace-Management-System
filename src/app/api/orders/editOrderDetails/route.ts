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
    const orderObjectBefore = await getOrder(orderId);

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

    const orderObjectAfter = await getOrder(orderId);
    const user = await prisma.getUser(username);
    const compareFields = (before: any, after: any) => {
      const changes: { [key: string]: { before: any; after: any } } = {};
      Object.keys(before).forEach((key) => {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
          changes[key] = { before: before[key], after: after[key] };
        }
      });
      return changes;
    };

    const changes = compareFields(orderObjectBefore, orderObjectAfter);
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
      context: JSON.stringify(user),
      timestamp: new Date(),
      dataBefore: orderObjectBefore,
      dataAfter: { ...orderObjectAfter, changes },
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

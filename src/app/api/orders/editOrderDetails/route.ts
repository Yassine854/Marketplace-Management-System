import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";
import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";
import { getOrder } from "@/services/orders/getOrder";

const areItemsDifferent = (beforeItem: any, afterItem: any) => {
  return (
    beforeItem.id !== afterItem.id ||
    beforeItem.quantity !== afterItem.quantity ||
    beforeItem.price !== afterItem.price ||
    beforeItem.totalPrice !== afterItem.totalPrice ||
    beforeItem.sku !== afterItem.sku ||
    beforeItem.weight !== afterItem.weight
  );
};

const compareItems = (beforeItems: any[], afterItems: any[]) => {
  const removedItems = beforeItems.filter(
    (beforeItem) =>
      !afterItems.some((afterItem) => afterItem.id === beforeItem.id),
  );

  const addedItems = afterItems.filter(
    (afterItem) =>
      !beforeItems.some((beforeItem) => beforeItem.id === afterItem.id),
  );

  const updatedItems = afterItems.filter((afterItem) =>
    beforeItems.some(
      (beforeItem) =>
        beforeItem.id === afterItem.id &&
        areItemsDifferent(beforeItem, afterItem),
    ),
  );
  const updatedItems1 = beforeItems.filter((beforeItem) =>
    afterItems.some(
      (afterItem) =>
        afterItem.id === beforeItem.id &&
        areItemsDifferent(afterItem, beforeItem),
    ),
  );

  const extractItemProperties = (items: any[]) => {
    return items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      weight: item.weight,
    }));
  };

  return {
    removedItems: extractItemProperties(removedItems),
    addedItems: extractItemProperties(addedItems),
    updatedItems: extractItemProperties(updatedItems),
    updatedItems1: extractItemProperties(updatedItems1),
  };
};

const convertUnixToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

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

    const { removedItems, addedItems, updatedItems, updatedItems1 } =
      compareItems(orderBefore.items, orderAfter.items);

    const stateBeforeUpdate = {
      updatedItems: updatedItems1.map((item) => {
        const originalItem = orderBefore.items.find(
          (i: { id: any }) => i.id === item.productId,
        );
        return { ...item, ...originalItem };
      }),
      removedItems: removedItems.map((item) => {
        const originalItem = orderBefore.items.find(
          (i: { productId: any }) => i.productId === item.productId,
        );
        return { ...item, ...originalItem };
      }),
      addedItems: addedItems.map((item) => {
        return { ...item };
      }),
    };

    await createLog({
      type: "Order",
      message: `Order edited`,
      context: JSON.stringify({
        userId: user?.id,
        username: user?.username,
        storeId: storeId,
      }),
      timestamp: new Date(),
      dataBefore: JSON.stringify({
        orderId: orderBefore.orderId,
        deliveryDate: convertUnixToDate(orderBefore.deliveryDate),
        total: orderBefore.total,
        items: {
          updatedItems: stateBeforeUpdate.updatedItems,
          removedItems: stateBeforeUpdate.removedItems,
          addedItems: stateBeforeUpdate.addedItems,
        },
        status: orderBefore.status,
      }),
      dataAfter: JSON.stringify({
        orderId: orderAfter.orderId,
        deliveryDate: convertUnixToDate(orderAfter.deliveryDate),
        total: orderAfter.total,
        items: {
          updatedItems: updatedItems,
          removedItems: removedItems,
          addedItems: addedItems,
        },
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

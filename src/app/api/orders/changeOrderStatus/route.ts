import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/clients/prisma";
import { createLog } from "../../../../clients/prisma/getLogs";
import { getOrder } from "@/services/orders/getOrder";
import { auth } from "../../../../services/auth";

export const POST = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log(session);
  const user = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  console.log(user);
  let currentOrder;
  try {
    const { orderId, status, state } = await request.json();
    if (!orderId) return responses.invalidRequest("orderId is Required");
    if (!status) return responses.invalidRequest("status is Required");
    if (!state) return responses.invalidRequest("state is Required");

    currentOrder = await getOrder(orderId);
    const orderBefore = {
      orderId: currentOrder.orderId,
      state: currentOrder.state,
      status: currentOrder.status,
    };

    const changeResponse = await magento.mutations.changeOrderStatus({
      orderId,
      status,
      state,
    });

    console.log(changeResponse);

    if (
      typeof changeResponse === "string" &&
      changeResponse.includes("Orders failed")
    ) {
      await createLog({
        type: "error",
        message: `Status change failed`,
        context: {
          userId: user.id,
          username: user.username,
          storeId: currentOrder.storeId,
        },
        timestamp: new Date(),
        dataBefore: orderBefore,
        dataAfter: "error",
        id: "",
      });
      return NextResponse.json(
        {
          message: changeResponse,
        },
        { status: 400 },
      );
    }

    console.log("no error");

    await typesense.orders.updateOne({
      id: orderId,
      status,
      state,
    });

    const updatedOrder = await getOrder(orderId);
    const orderAfter = {
      orderId: updatedOrder.orderId,
      state: updatedOrder.state,
      status: updatedOrder.status,
    };

    console.log("updated successfully");

    // const user = await prisma.getUser(username);
    // if (!user) return responses.invalidRequest("User not found");

    await createLog({
      type: "Order",
      message: `order status changed`,
      context: {
        userId: user.id,
        username: user.username,
        storeId: currentOrder.storeId,
      },
      timestamp: new Date(),
      dataBefore: orderBefore,
      dataAfter: orderAfter,
      id: "",
    });

    console.log(" created successfully");

    return NextResponse.json(
      {
        message: "Order Status Changed Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    await createLog({
      type: "error",
      message: error.message || "Internal Server Error",
      context: {
        userId: user.id,
        username: user.username,
        storeId: currentOrder?.storeId || "unknown",
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
    logError(error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

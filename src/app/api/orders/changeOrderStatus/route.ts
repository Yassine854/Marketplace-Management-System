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
  try {
    const { orderId, status, state } = await request.json();

    // Validate input parameters
    if (!orderId) return responses.invalidRequest("orderId is Required");
    if (!status) return responses.invalidRequest("status is Required");
    if (!state) return responses.invalidRequest("state is Required");

    const currentOrder = await getOrder(orderId);

    if (!currentOrder)
      return responses.invalidRequest("Missing required fields");

    const dataBefore = JSON.stringify(currentOrder);

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
        dataBefore: dataBefore,
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

    const updatedOrder = getOrder(orderId);
    if (!updatedOrder)
      return responses.invalidRequest("failed to fetch updated order");

    const dataAfter = JSON.stringify(updatedOrder);

    console.log("updated successfully");

    // const user = await prisma.getUser(username);
    // if (!user) return responses.invalidRequest("User not found");

    await createLog({
      type: "Order",
      message: `order changed`,
      context: {
        userId: user.id,
        username: user.username,
        storeId: currentOrder.storeId,
      },
      timestamp: new Date(),
      dataBefore: currentOrder.status,
      dataAfter: status,
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
    logError(error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

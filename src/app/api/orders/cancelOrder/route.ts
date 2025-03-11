import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/services/auditing/orders";
import { prisma } from "@/clients/prisma";
import { getOrder } from "@/services/orders/getOrder";
import { createLog } from "@/clients/prisma/getLogs";
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
    const { orderId, username } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }
    await magento.mutations.cancelOrder(orderId);

    // Ensure orderId is a string, if it's an array, join it into a string
    const orderIds = Array.isArray(orderId)
      ? orderId
      : orderId.split(",").map((id: string) => id.trim());

    // Check if orderIds is an array of order IDs
    if (!Array.isArray(orderIds)) {
      return responses.invalidRequest("Invalid orderId format");
    }

    const user = await prisma.getUser(username.username);

    for (let id of orderIds) {
      try {
        await typesense.orders.cancelOne(id);

        const currentOrder = await getOrder(id);

        await createLog({
          type: "Order",
          message: `order canceled`,
          context: {
            userId: user?.id,
            username: user?.username,
            storeId: currentOrder?.storeId,
          },
          timestamp: new Date(),
          dataBefore: currentOrder.status,
          dataAfter: "canceled",
          id: "",
        });
      } catch (error) {
        console.error(`Failed to process order ${id}:`, error);
      }
    }

    return NextResponse.json(
      { message: "Orders Canceled Successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return responses.internalServerError(error.message);
  }
};

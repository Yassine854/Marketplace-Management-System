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
import { id } from "date-fns/locale";

export const POST = async (request: NextRequest) => {
  let storeId: string = "";
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  //
  const user = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  //
  try {
    const { orderId, username } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }
    await magento.mutations.cancelOrder(orderId);

    const orderIds = Array.isArray(orderId)
      ? orderId
      : orderId.split(",").map((id: string) => id.trim());

    if (!Array.isArray(orderIds)) {
      return responses.invalidRequest("Invalid orderId format");
    }

    for (let id of orderIds) {
      try {
        const orderBefor = await getOrder(id);
        const storeId = orderBefor.storeId;
        const orderBefore = {
          orderId: orderBefor.id,
          state: orderBefor.state,
          status: orderBefor.status,
        };
        await magento.mutations.cancelOrder(id);
        await typesense.orders.cancelOne(id);

        await createLog({
          type: "Order",
          message: `order canceled`,
          context: {
            userId: user?.id,
            username: user?.username,
            storeId: storeId,
          },
          timestamp: new Date(),
          dataBefore: orderBefore.status,
          dataAfter: "canceled",
          id: "",
        });
      } catch (error) {
        await createLog({
          type: "error",
          message: (error as Error).message || "Internal Server Error",
          context: {
            userId: user?.id,
            username: user.username,
            storeId: storeId,
          },
          timestamp: new Date(),
          dataBefore: {},
          dataAfter: "error",
          id: "",
        });
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

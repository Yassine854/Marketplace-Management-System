import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/services/auditing/orders";
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

    // Ensure orderId is a string, if it's an array, join it into a string
    const orderIds = Array.isArray(orderId) 
      ? orderId 
      : orderId.split(',').map((id: string) => id.trim());

    // Check if orderIds is an array of order IDs
    if (!Array.isArray(orderIds)) {
      return responses.invalidRequest("Invalid orderId format");
    }

    // Ensure the user exists
    const user = await prisma.getUser(username.username);

    for (let id of orderIds) {
      try {
        // Process each order ID separately
        await typesense.orders.cancelOne(id);

        const order = await getOrder(id);

        await createAuditLog({
          username: user?.username ?? "",
          userId: user?.id ?? "",
          action: `${user?.firstName}-${user?.lastName} canceled order`,
          actionTime: new Date(),
          orderId: id,
          storeId: order?.storeId,
        });

        //console.log(`Order ${id} processed successfully.`);
      } catch (error) {
        console.error(`Failed to process order ${id}:`, error);
      }
    }

    return NextResponse.json(
      { message: "Orders Canceled Successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return responses.internalServerError(error.message);
  }
};

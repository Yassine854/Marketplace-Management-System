import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createAuditLog } from "@/services/auditing/orders";
import { getOrder } from "@/services/orders/getOrder";

export const POST = async (request: NextRequest) => {
  try {
    const { orderId, status, state, username } = await request.json();

    // Validate input parameters
    if (!orderId) return responses.invalidRequest("orderId is Required");
    if (!status) return responses.invalidRequest("status is Required");
    if (!state) return responses.invalidRequest("state is Required");
    if (!username) return responses.invalidRequest("username is Required");

    // Change order status
    const changeResponse = await magento.mutations.changeOrderStatus({ orderId, status, state });
    

    // Check for failure in the response
    if (typeof changeResponse === 'string' && changeResponse.includes("Orders failed")) {
      logError(changeResponse); // Log the error
      return NextResponse.json(
        {
          message: changeResponse, // Return the error message
        },
        { status: 400 } // Use a 400 status for a client error
      );
    }

    // If no error, continue with updating Typesense
    await typesense.orders.updateOne({
      id: orderId,
      status,
      state,
    });

    // Get order and user information
    const order = await getOrder(orderId);
   // const user = await prisma.getUser(username);
   // if (!user) return responses.invalidRequest("User not found");

    // Create audit log
    /*
    await createAuditLog({
      username: user?.username ?? "",
      userId: user?.id ?? "",
      action: `${username} changed order status to ${status}`,
      actionTime: new Date(),
      orderId: orderId,
      storeId: order?.storeId,
    });
*/
    // Return success response
    return NextResponse.json(
      {
        message: "Order Status Changed Successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    logError(error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error", // Include error message
      },
      { status: 500 }
    );
  }
};

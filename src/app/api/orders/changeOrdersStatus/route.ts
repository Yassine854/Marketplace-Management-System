import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { createAuditLog } from "@/services/auditing/orders";
import { getOrder } from "@/services/orders/getOrder";
import { axios } from "@/libs/axios";
export const POST = async (request: NextRequest) => {
  const errorMessages: string[] = [];
  try {
    const { orders, status, state, username } = await request.json();
    let ordersArray = Array.isArray(orders)
      ? orders
      : orders?.split(",").map((order: string) => order.trim());
    if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
      return NextResponse.json(
        { message: "orders is required and must be a non-empty array" },
        { status: 400 },
      );
    }
    if (!status) return responses.invalidRequest("status is required");
    if (!state) return responses.invalidRequest("state is required");
    if (!username) return responses.invalidRequest("username is required");
    const formattedOrders = ordersArray.map((orderId) => ({
      orderId: orderId,
      status: status,
      state: state,
    }));
    let changeResponse: any = "";
    if (status === "unpaid") {
      changeResponse = await axios.magentoClient.post(
        "orders/manage/complete",
        {
          orders: ordersArray.join(","),
        },
      );
    } else {
      changeResponse = await axios.magentoClient.put("orders/status_change", {
        orders: formattedOrders,
      });
    }
    if (typeof changeResponse === "string") {
      if (changeResponse.includes("Orders failed")) {
        logError(changeResponse);
        const failedOrderIds = changeResponse.match(/order id : (\d+)/g);
        const extractedOrderIds = failedOrderIds
          ? failedOrderIds
              .map((order: string) => order.split(": ")[1])
              .join(", ")
          : "";
        errorMessages.push(`Failed to process orders: ${changeResponse}`);
      }
    } else if (changeResponse && typeof changeResponse === "object") {
      if (
        changeResponse.data &&
        typeof changeResponse.data === "string" &&
        changeResponse.data.includes("Orders failed")
      ) {
        logError(changeResponse.data);
        const failedOrderIds = changeResponse.data.match(/order id : (\d+)/g);
        const extractedOrderIds = failedOrderIds
          ? failedOrderIds
              .map((order: string) => order.split(": ")[1])
              .join(", ")
          : "";
        errorMessages.push(`Failed to process orders: ${changeResponse.data}`);
      }
    } else {
      logError("Unexpected response format");
      errorMessages.push("Unexpected response format received.");
    }
    const results = [];
    for (const orderId of ordersArray) {
      if (!changeResponse?.data?.includes(`order id : ${orderId}`)) {
        try {
          await typesense.orders.updateOne({
            id: orderId,
            status,
            state,
          });
          const order = await getOrder(orderId);
          // const user = await prisma.getUser(username);
          /*    if (!user) {
            results.push({ orderId, success: false, message: "User not found" });
            continue;
          }
*/
          /*
          await createAuditLog({
            username: user.username ?? "",
            userId: user.id ?? "",
            action: `${username} changed order status to ${status}`,
            actionTime: new Date(),
            orderId,
            storeId: order?.storeId,
          });
*/
          results.push({
            orderId,
            success: true,
            message: "Order Status Changed Successfully",
          });
        } catch (error) {
          logError(error);
          results.push({
            orderId,
            success: false,
            message: `Failed to update order ${orderId}: `,
          });
          errorMessages.push(`Error processing order ${orderId}:`);
        }
      } else {
        results.push({
          orderId,
          success: false,
          message: "Order not processed due to previous errors",
        });
      }
    }
    return NextResponse.json(
      {
        results,
        message: errorMessages.length > 0 ? errorMessages : undefined,
      },
      { status: errorMessages.length > 0 ? 400 : 200 },
    );
  } catch (error: any) {
    logError(error);
    return NextResponse.json(
      {
        message: errorMessages || error.message || "Internal Server Error",
        errors: errorMessages.length > 0 ? errorMessages : undefined,
      },
      { status: 500 },
    );
  }
};

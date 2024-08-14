import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/services/auditing";

export const POST = async (request: NextRequest) => {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }

    await magento.mutations.cancelOrder(orderId);

    await typesense.orders.cancelOne(orderId);
    //@ts-ignore
    await createAuditLog({
      username: "fatima",
      userId: " 123",
      action: `user canceled order `,
      actionTime: new Date(),
      orderId: orderId,
    });

    return NextResponse.json(
      {
        message: "Order Canceled  Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

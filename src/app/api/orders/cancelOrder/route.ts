import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }

    await magento.mutations.cancelOrder(orderId);

    await typesense.orders.updateOne({
      order: {
        id: orderId,
        status: "failed",
        state: "canceled",
      },
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

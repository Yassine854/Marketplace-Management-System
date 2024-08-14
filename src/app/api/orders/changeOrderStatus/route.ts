import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { orderId, status, state } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }
    if (!status) {
      return responses.invalidRequest("status is Required");
    }

    if (!state) {
      return responses.invalidRequest("state is Required");
    }

    await magento.mutations.changeOrderStatus({ orderId, status, state });

    await typesense.orders.updateOne({
      orderId,
      status,
      state,
    });

    return NextResponse.json(
      {
        message: "Order Status Changed  Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

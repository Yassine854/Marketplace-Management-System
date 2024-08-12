import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const { order } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    const { total, orderId, items, deliveryDate } = order;

    await magento.mutations.editOrderDetails({
      total,
      items,
      orderId,
      deliveryDate,
    });

    await typesense.orders.updateOne({
      total,
      items,
      orderId,
      deliveryDate,
    });

    return NextResponse.json(
      {
        message: "Order Edited  Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logError(error);
    return responses.internalServerError(error);
  }
};

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderItems } from "@/services/orders/magento/getOrderItems";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return responses.invalidRequest("orderId parameter is Required");
    }

    const res = await getOrderItems(orderId);

    return NextResponse.json(res);
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};

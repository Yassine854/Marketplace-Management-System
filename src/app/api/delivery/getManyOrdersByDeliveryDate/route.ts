import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getOrdersByDeliveryDate } from "@/services/delivery/getOrdersByDeliveryDate";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const storeId = searchParams.get("storeId");

    const deliveryDate = searchParams.get("deliveryDate");

    if (!storeId) {
      return responses.invalidRequest("storeId parameter is Required");
    }

    if (!deliveryDate) {
      return responses.invalidRequest("deliveryDate parameter is Required");
    }

    const res = await getOrdersByDeliveryDate({
      deliveryDate,
      storeId,
    });

    return NextResponse.json(res);
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};

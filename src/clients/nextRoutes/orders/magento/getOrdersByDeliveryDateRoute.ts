import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getOrdersByDeliveryDate } from "@/services/orders/getOrdersByDeliveryDate";

export const getOrdersByDeliveryDateRoute = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const deliveryDate = searchParams.get("deliveryDate");

    const res = await getOrdersByDeliveryDate(Number(deliveryDate));

    return NextResponse.json(res);
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};

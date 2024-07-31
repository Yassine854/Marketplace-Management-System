import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getOrder } from "@/services/orders/getOrder";

export const getOrderRoute = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return responses.invalidRequest("id parameter is Required");
    }

    const res = await getOrder(id);

    return NextResponse.json(res);
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};

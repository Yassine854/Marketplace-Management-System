import { responses } from "@/clients/nextRoutes/responses";
import { logError } from "@/utils/logError";
import { getOrder } from "@/services/orders/getOne";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
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

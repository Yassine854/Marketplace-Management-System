import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { getOrder } from "@/services/orders/getOrder";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return responses.invalidRequest("id parameter is Required");
    }

    const order = await getOrder(id);

    return NextResponse.json(
      {
        message: "success",
        data: { order },
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};

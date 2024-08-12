import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nooByDay } from "@/services/analytics/numberOfOrders/nooByDay";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const currentDay = searchParams.get("day");

    if (!currentDay) {
      return responses.invalidRequest("day Parameter is Required");
    }
    const res = await nooByDay(currentDay);
    return NextResponse.json(
      {
        message: "success",
        data: res,
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

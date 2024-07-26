import { responses } from "../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrderByCurrentDayAnalytics } from "@/services/analytics/numberOfOrdersByCurrentDayAnalytics";

export const numberOfOrdersByCurrentDayAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const currentDay = searchParams.get("day");

    if (!currentDay) {
      return responses.invalidRequest("Date Parameter is Required");
    }
    const res = await numberOfOrderByCurrentDayAnalytics(currentDay);
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

import { responses } from "../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrderByWeekAnalytics } from "@/services/analytics/numberOfOrdersByWeekAnalytics";

export const numberOfOrdersByWeekAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const week = searchParams.get("week");

    if (!week) {
      return responses.typesense.invalidRequest("Date Parameter is Required");
    }
    const res = await numberOfOrderByWeekAnalytics(week);
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

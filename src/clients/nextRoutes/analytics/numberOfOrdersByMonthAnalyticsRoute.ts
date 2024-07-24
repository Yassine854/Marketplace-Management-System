import { responses } from "../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrderByMonthAnalytics } from "@/services/analytics/numberOfOrdersByMonthAnalytics.ts";

export const numberOfOrdersByMonthAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const month = searchParams.get("month");

    if (!month) {
      return responses.typesense.invalidRequest("Date Parameter is Required");
    }

    const res = await numberOfOrderByMonthAnalytics(month);

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

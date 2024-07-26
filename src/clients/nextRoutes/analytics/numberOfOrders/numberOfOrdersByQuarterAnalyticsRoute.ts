import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrderByQuarterAnalytics } from "@/services/analytics/numberOfOrdersByQuarterAnalytics";

export const numberOfOrdersByQuarterAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");

    if (!yearString) {
      return responses.invalidRequest("Date Parameter is Required");
    }

    const year = parseInt(yearString, 10);

    const res = await numberOfOrderByQuarterAnalytics(year);
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

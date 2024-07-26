import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrdersLifetimeAnalytics } from "@/services/analytics/numberOfOrdersLifetimeAnalytics";
export const numberOfOrdersLifetimeAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const startYearString = searchParams.get("startYear");
    const endYearString = searchParams.get("endYear");

    if (!startYearString) {
      return responses.invalidRequest("startYear Parameter is Required");
    }
    if (!endYearString) {
      return responses.invalidRequest("endYear Parameter is Required");
    }

    const startYear = parseInt(startYearString, 10);
    const endYear = parseInt(endYearString, 10);

    const res = await numberOfOrdersLifetimeAnalytics(startYear, endYear);
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

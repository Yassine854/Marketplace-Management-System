import { grossMarketValueByQuarterAnalytics } from "@/services/analytics/gmv/gmvByQuarterAnalytics";
import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { grossMarketValueByWeekAnalytics } from "@/services/analytics/gmv/gmvByWeekAnalytics";

export const grossMarketValueByWeekAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");
    const weekString = searchParams.get("week");

    if (!yearString) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    if (!weekString) {
      return responses.invalidRequest("Week Parameter is Required");
    }

    const year = parseInt(yearString, 10);
    const week = parseInt(weekString, 10);

    const res = await grossMarketValueByWeekAnalytics(year, week);
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

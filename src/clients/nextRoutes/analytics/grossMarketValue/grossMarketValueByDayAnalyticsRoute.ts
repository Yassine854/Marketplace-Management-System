import { grossMarketValueByYearAnalytics } from "@/services/analytics/grossMarketValue/grossMarketValueByYearAnalytics";
import { responses } from "../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { grossMarketValueByDayAnalytics } from "@/services/analytics/grossMarketValue/grossMarketValueByDayAnalytics";

export const grossMarketValueByDayAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const isoDate = searchParams.get("date");

    if (!isoDate || typeof isoDate !== "string") {
      throw new Error("Date parameter is required");
    }

    const res = await grossMarketValueByDayAnalytics(isoDate);
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

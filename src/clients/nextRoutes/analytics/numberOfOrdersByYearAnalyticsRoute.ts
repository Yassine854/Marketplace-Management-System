import { responses } from "../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { numberOfOrdersByYearAnalytics } from "@/services/analytics/numberOfOrdersByYearAnalytics";
export const numberOfOrdersByYearAnalyticsRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    if (!year) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    const res = await numberOfOrdersByYearAnalytics(year);
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

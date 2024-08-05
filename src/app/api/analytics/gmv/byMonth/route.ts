import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { gmvByMonthAnalytics } from "@/services/analytics/gmv/gmvByMonthAnalytics";
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    if (!month) {
      return responses.invalidRequest("Month Parameter is Required");
    }
    if (!year) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    const res = await gmvByMonthAnalytics(year, month);
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

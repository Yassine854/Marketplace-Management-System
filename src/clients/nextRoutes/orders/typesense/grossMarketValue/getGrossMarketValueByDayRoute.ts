import { responses } from "../../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getGrossMarketValueByDay } from "@/services/orders/typesense/grossMarketValue/getGrossMarketValueByDay";
export const getGrossMarketValueByDayRoute = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");
    const monthString = searchParams.get("month");
    const dayString = searchParams.get("day");
    if (!yearString) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    if (!monthString) {
      return responses.invalidRequest("Month Parameter is Required");
    }
    if (!dayString) {
      return responses.invalidRequest("Day Parameter is Required");
    }
    const year = parseInt(yearString, 10);
    const month = parseInt(monthString, 10);
    const day = parseInt(dayString, 10);
    const gmv: number | undefined = await getGrossMarketValueByDay(
      year,
      month,
      day,
    );

    if (!gmv) {
      return responses.internalServerError(
        "Gross Market Value By Day is Undefined",
      );
    }

    const date = year + "-M" + month + "-" + day;

    return NextResponse.json(
      {
        message: "success",
        gmv,
        date,
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

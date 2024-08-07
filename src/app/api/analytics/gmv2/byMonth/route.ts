import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getGmvByMonth } from "@/clients/typesense/orders/gmv/getGmvByMonth";
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");
    const monthString = searchParams.get("month");

    if (!yearString) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    if (!monthString) {
      return responses.invalidRequest("Month Parameter is Required");
    }
    const year = parseInt(yearString, 10);
    const month = parseInt(monthString, 10);

    const gmv: number | undefined = await getGmvByMonth(year, month);

    if (!gmv) {
      return responses.internalServerError(
        "Gross Market Value By Month is Undefined",
      );
    }

    const date = year + "-M" + month;

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

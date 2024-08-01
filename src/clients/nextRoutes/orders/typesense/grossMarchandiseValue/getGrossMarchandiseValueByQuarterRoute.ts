import { responses } from "../../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getGrossMarketValueByQuarter } from "@/services/orders/typesense/gmv/getGmvByQuarter";
export const getGrossMarketValueByQuarterRoute = async (
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const yearString = searchParams.get("year");
    const quarter = searchParams.get("quarter");

    if (!yearString) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    if (!quarter) {
      return responses.invalidRequest("Quarter Parameter is Required");
    }
    const year = parseInt(yearString, 10);

    const gmv: number | undefined = await getGrossMarketValueByQuarter(
      year,
      quarter,
    );

    if (!gmv) {
      return responses.internalServerError(
        "Gross Market Value By Quarter is Undefined",
      );
    }

    const date = year + "-" + quarter;

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

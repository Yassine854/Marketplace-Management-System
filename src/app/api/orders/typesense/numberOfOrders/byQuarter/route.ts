import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getNumberOfOrdersByQuarter } from "@/services/orders/typesense/numberOfOrders/getNumberOfOrdersByQuarter";

export const GET = async (request: NextRequest) => {
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

    const numberOfOrders: number | undefined = await getNumberOfOrdersByQuarter(
      year,
      quarter,
    );

    if (!numberOfOrders) {
      return responses.internalServerError("Number of Orders is Undefined");
    }

    const date = year + "-" + quarter;

    return NextResponse.json(
      {
        message: "success",
        numberOfOrders,
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

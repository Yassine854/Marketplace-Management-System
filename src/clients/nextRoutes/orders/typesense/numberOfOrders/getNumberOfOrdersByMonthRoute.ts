import { responses } from "../../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getNumberOfOrdersByMonth } from "@/services/orders/typesense/numberOfOrders/getNumberOfOrdersByMonth";

export const getNumberOfOrdersByMonthRoute = async (request: NextRequest) => {
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

    const numberOfOrders: number | undefined = await getNumberOfOrdersByMonth(
      year,
      month,
    );

    if (!numberOfOrders) {
      return responses.internalServerError("Number of Orders is Undefined");
    }

    const date = year + "-" + month;

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

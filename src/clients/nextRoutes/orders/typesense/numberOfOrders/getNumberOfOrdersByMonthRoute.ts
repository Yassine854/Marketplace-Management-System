import { responses } from "../../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getNumberOfOrdersByMonth } from "@/services/orders/typesense/numberOfOrders/getNumberOfOredersByMonth";

export const getNumberOfOrdersByMonthRoute = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");

    if (!date) {
      return responses.invalidRequest("Date Parameter is Required");
    }

    const numberOfOrders: number | undefined = await getNumberOfOrdersByMonth(
      date,
    );

    if (!numberOfOrders) {
      return responses.internalServerError("Number of Orders is Undefined");
    }
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

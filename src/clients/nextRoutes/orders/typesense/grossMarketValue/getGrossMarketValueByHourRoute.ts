import { getGrossMarketValueByHour } from "@/clients/typesense/orders/grossMarketValue/getGrossMarketValueByHour";
import { responses } from "../../../responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
export const getGrossMarketValueByHourRoute = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");

    if (!date || typeof date !== "string") {
      throw new Error("Date parameter is required");
    }
    const gmv: number[] | undefined = await getGrossMarketValueByHour(date);

    if (!gmv) {
      return responses.internalServerError(
        "Gross Market Value Day By Hour is Undefined",
      );
    }

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

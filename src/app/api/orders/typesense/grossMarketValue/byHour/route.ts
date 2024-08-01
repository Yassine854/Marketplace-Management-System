import { getGrossMarketValueByHour } from "@/clients/typesense/orders/grossMarchandiseValue/getGrossMarchandiseValueByHour";
import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");

    if (!date || typeof date !== "string") {
      throw new Error("Date parameter is required");
    }

    const [year, month, day] = date.split("-").map(Number);

    const gmv: [string, number][] | undefined = await getGrossMarketValueByHour(
      year,
      month,
      day,
    );

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

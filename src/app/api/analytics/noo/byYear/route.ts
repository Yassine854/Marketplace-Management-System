import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nooByYear } from "@/services/analytics/numberOfOrders/nooByYear";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    if (!year) {
      return responses.invalidRequest("Year Parameter is Required");
    }
    const { data, total } = await nooByYear(year);
    return NextResponse.json(
      {
        message: "success",
        total,
        data,
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

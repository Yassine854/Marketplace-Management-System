import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { nucByYear } from "@/services/analytics/numberOfUniqueCustomers/nucByYear";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("year");

    if (!date) {
      return responses.invalidRequest("Date Parameter is Required");
    }
    const res = await nucByYear(date);

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

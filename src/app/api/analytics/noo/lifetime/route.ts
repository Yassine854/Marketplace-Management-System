import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";

import { nooLifetime } from "@/services/analytics/numberOfOrders/nooLifetime";

export const GET = async (request: NextRequest) => {
  try {
    const { data, total } = await nooLifetime();
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

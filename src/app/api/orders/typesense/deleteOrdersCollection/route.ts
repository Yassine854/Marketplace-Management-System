import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";

export const DELETE = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    console.info("Orders Collection delete ...");

    await typesense.orders.deleteCollection();

    console.info("Orders Collection deleted successfully ");

    return NextResponse.json({
      message: "Orders Collection Deleted Successfully ...",
      status: 200,
    });
  } catch (error: any) {
    logError(error);

    responses.internalServerError(error);
  }
};

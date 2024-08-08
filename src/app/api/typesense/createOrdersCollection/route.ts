import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const isOrdersCollectionExist = await typesense.isCollectionExist("orders");

    if (!isOrdersCollectionExist) {
      await typesense.orders.createCollection();
      return NextResponse.json({
        message: "Orders Collection Created Successfully",
        status: 200,
      });
    }

    return NextResponse.json({
      message: "Orders Collection Already  Exist ...",
      status: 409,
    });
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";
    if (message.includes("Request failed with HTTP code 404")) {
      return NextResponse.json(
        {
          error: "Collection Not Found.",
        },
        {
          status: 404,
        },
      );
    }

    responses.internalServerError(error);
  }
};

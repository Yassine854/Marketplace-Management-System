import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextResponse, type NextRequest } from "next/server";
import { populateCollection } from "@/services/typesense/populateGmvPreviousDaysCollection/populateCollection";

export const POST = async (request: NextRequest) => {
  try {
    const isGmvDaysCollectionExist = await typesense.isCollectionExist(
      "gmvPreviousDays",
    );

    if (isGmvDaysCollectionExist) {
      populateCollection();
      return NextResponse.json({
        message: "gmvPreviousDays Collection populating ...",
        status: 202,
      });
    }

    return NextResponse.json({
      message: "gmvPreviousDays Collection Doesn't Exist ...",
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

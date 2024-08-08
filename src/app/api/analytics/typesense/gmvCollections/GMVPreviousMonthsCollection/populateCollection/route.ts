//import { populateGMVPreviousMonths } from "@/services/orders/typesense/grossMerchandiseValueCollections/gmvPreviousMonthsCollection/populategmvPrevMonthsColl";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const result = await populateGMVPreviousMonths();
    const result = undefined;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update GMV previous months data" },
      { status: 500 },
    );
  }
}

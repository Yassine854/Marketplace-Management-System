import { populateGMVPreviousMonths } from "@/clients/typesense/orders/grossMarketValue/gmvCollection/populategmvPrevMonthsColl";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const result = await populateGMVPreviousMonths();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update GMV previous months data" },
      { status: 500 },
    );
  }
}

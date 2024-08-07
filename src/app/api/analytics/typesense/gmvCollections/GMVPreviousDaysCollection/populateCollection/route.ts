import { populateGMVPreviousDays } from "@/services/analytics/typesense/grossMarchandiseValueCollections/GMVPreviousDaysCollection/populategmvPrevDaysColl";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const result = undefined;
    //await populateGMVPreviousDays();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update GMV previous days data" },
      { status: 500 },
    );
  }
}

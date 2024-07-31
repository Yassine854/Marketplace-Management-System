import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";
import { displayColl } from "@/services/orders/typesense/grossMarchandiseValueCollections/displayGMVCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = gmvPreviousDaysCollectionSchema.name;
    const result = await displayColl(request, collectionName);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous days data" },
      { status: 500 },
    );
  }
}

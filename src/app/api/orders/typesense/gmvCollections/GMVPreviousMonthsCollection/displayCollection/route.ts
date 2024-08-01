import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/GMVPreviousMonthsCollection";
import { displayCollection } from "@/services/orders/typesense/displayCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = gmvPreviousMonthsCollectionSchema.name;
    const query = "year,month";
    const result = await displayCollection(request, collectionName, "", query);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous months data" },
      { status: 500 },
    );
  }
}

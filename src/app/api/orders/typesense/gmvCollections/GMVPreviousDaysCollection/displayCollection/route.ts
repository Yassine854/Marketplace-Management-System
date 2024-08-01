import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";
import { displayCollection } from "@/services/orders/typesense/displayCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = gmvPreviousDaysCollectionSchema.name;
    const result = await displayCollection(
      request,
      collectionName,
      "",
      "year,month",
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous days data" },
      { status: 500 },
    );
  }
}

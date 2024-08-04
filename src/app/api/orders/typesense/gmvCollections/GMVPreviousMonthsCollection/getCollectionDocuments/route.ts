import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/gmvPreviousMonthsCollection";
import { getCollectionDocuments } from "@/services/orders/typesense/getCollectionDocuments";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = gmvPreviousMonthsCollectionSchema.name;
    const result = await getCollectionDocuments(
      collectionName,
      "",
      "year,month",
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous Months data" },
      { status: 500 },
    );
  }
}

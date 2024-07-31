import { NextResponse } from "next/server";
import { deleteGMVCollection } from "@/services/orders/typesense/grossMarchandiseValueCollections/deleteGMVCollection";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/GMVPreviousMonthsCollection";

export async function DELETE(Request: any) {
  try {
    await deleteGMVCollection(gmvPreviousMonthsCollectionSchema.name);
    return NextResponse.json(
      "GMV Previous Months Collection Deleted Successfully ...",
      {
        status: 200,
      },
    );
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

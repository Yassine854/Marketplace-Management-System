import { NextResponse } from "next/server";
import { deleteGMVCollection } from "@/services/orders/typesense/grossMarchandiseValueCollections/deleteGMVCollection";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";

export async function DELETE(Request: any) {
  try {
    await deleteGMVCollection(gmvPreviousDaysCollectionSchema.name);
    return NextResponse.json(
      "GMV Previous Days Collection Deleted Successfully ...",
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

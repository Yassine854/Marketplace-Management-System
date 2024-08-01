import { NextResponse } from "next/server";
import { deleteCollection } from "@/services/orders/typesense/deleteCollection";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";

export async function DELETE(Request: any) {
  try {
    await deleteCollection(gmvPreviousDaysMasterCollectionSchema.name);
    return NextResponse.json(
      gmvPreviousDaysMasterCollectionSchema.name +
        "Collection Deleted Successfully ...",
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

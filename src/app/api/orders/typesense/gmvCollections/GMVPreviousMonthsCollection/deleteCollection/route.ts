import { NextResponse } from "next/server";
import { deleteCollection } from "@/services/orders/typesense/deleteCollection";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/GMVPreviousMonthsCollection";

export async function DELETE(Request: any) {
  try {
    await deleteCollection(gmvPreviousMonthsCollectionSchema.name);
    return NextResponse.json(
      gmvPreviousMonthsCollectionSchema.name +
        " Collection Deleted Successfully ...",
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

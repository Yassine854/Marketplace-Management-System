import { NextResponse } from "next/server";
import { deleteCollection } from "@/clients/typesense/deleteCollection";
import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/nucPreviousMonthsCollection";

export async function DELETE(Request: any) {
  try {
    await deleteCollection(nucPreviousMonthsCollectionSchema.name);
    return NextResponse.json(
      nucPreviousMonthsCollectionSchema.name +
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

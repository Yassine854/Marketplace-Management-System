import { NextResponse } from "next/server";
import { deleteCollection } from "@/clients/typesense/deleteCollection";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schemas/GMVPreviousDaysCollection";

export async function DELETE(request: any) {
  try {
    await deleteCollection(gmvPreviousDaysCollectionSchema.name);
    return NextResponse.json(
      gmvPreviousDaysCollectionSchema.name +
        " Collection Deleted Successfully ...",
      {
        status: 200,
      },
    );
  } catch (err: any) {
    if (err.message.includes("does not exist")) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: 404,
        },
      );
    }
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}

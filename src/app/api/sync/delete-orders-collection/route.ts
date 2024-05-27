import { NextResponse } from "next/server";
import { deleteOrdersCollection } from "@/services/sync/delete-orders-collection";

export async function DELETE(Request: any) {
  try {
    await deleteOrdersCollection();
    return NextResponse.json("Orders Collection Deleted Successfully ...", {
      status: 200,
    });
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import { deleteOrdersCollection } from "@/services/orders/typesense/delete-orders-collection";

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

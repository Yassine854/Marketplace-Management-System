import { NextResponse } from "next/server";
import { deleteOrdersCollection } from "@/services/orders/typesense/delete-orders-collection";
import { logError } from "@/utils/logError";
export async function DELETE(Request: any) {
  try {
    await deleteOrdersCollection();
    return NextResponse.json("Orders Collection Deleted Successfully ...", {
      status: 200,
    });
  } catch (err) {
    logError(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

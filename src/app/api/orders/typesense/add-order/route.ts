import { NextResponse } from "next/server";
import { deleteOrdersCollection } from "@/services/orders/delete-orders-collection";

export async function POST(Request: any) {
  try {
    await deleteOrdersCollection();
    return NextResponse.json("Orders Collection Deleted Successfully ...", {
      status: 200,
    });
    throw new Error();
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import { deletegmvCollection } from "@/services/orders/typesense/gmvCollection/deletegmvPrevMonthsColl";

export async function DELETE(Request: any) {
  try {
    await deletegmvCollection();
    return NextResponse.json("gmv Collection Deleted Successfully ...", {
      status: 200,
    });
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

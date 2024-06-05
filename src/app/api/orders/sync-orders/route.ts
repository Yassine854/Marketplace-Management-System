import { NextResponse } from "next/server";
import { startIndexingStream } from "@/services/orders/sync-orders/startIndexingStream";

export async function POST(Request: any) {
  startIndexingStream();
  //  return new NextResponse.json("This is a new API route", { status: 202 });
  return NextResponse.json("Orders Syncing ...", { status: 202 });
}

import { NextResponse } from "next/server";
import { logError } from "@/utils/logError";
export async function GET(Request: any) {
  try {
    return NextResponse.json("Orders Collection Syncing : 40 % ", {
      status: 200,
    });
  } catch (err) {
    logError(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

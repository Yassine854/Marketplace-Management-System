import { NextResponse } from "next/server";

export async function GET(Request: any) {
  try {
    return NextResponse.json("Orders Collection Syncing : 40 % ", {
      status: 200,
    });
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}

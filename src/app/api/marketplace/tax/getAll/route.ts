// app/api/taxes/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all taxes
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const taxes = await prisma.tax.findMany(); // Retrieve all taxes

    if (taxes.length === 0) {
      return NextResponse.json(
        { message: "No taxes found", taxes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Taxes retrieved successfully", taxes },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve taxes" },
      { status: 500 },
    );
  }
}

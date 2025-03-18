// app/api/statuses/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all statuses
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const statuses = await prisma.status.findMany(); // Retrieve all statuses

    if (statuses.length === 0) {
      return NextResponse.json(
        { message: "No statuses found", statuses: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Statuses retrieved successfully", statuses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve statuses" },
      { status: 500 },
    );
  }
}

// app/api/manufacturers/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all manufacturers
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const manufacturers = await prisma.manufacturer.findMany(); // Retrieve all manufacturers

    if (manufacturers.length === 0) {
      return NextResponse.json(
        { message: "No manufacturers found", manufacturers: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Manufacturers retrieved successfully", manufacturers },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve manufacturers" },
      { status: 500 },
    );
  }
}

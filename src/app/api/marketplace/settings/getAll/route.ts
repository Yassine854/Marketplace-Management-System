// app/api/settings/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all Settings
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.settings.findMany({
      include: {
        partner: true,
        schedules: true,
      },
    });

    if (settings.length === 0) {
      return NextResponse.json(
        { message: "No Settings found", settings: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Settings retrieved successfully", settings },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching Settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Settings" },
      { status: 500 },
    );
  }
}

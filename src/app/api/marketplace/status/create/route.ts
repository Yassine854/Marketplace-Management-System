// app/api/statuses/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new status
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Create the status in the database
    const newStatus = await prisma.status.create({
      data: {
        name: body.name,
        stateId: body.stateId,
      },
    });

    return NextResponse.json(
      { message: "Status created successfully", status: newStatus },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating status:", error);
    return NextResponse.json(
      { error: "Failed to create status" },
      { status: 500 },
    );
  }
}

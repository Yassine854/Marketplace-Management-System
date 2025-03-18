// app/api/states/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new state
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const body = await req.json();

    // Create the state in the database
    const newState = await prisma.state.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { message: "State created successfully", state: newState },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating state:", error);
    return NextResponse.json(
      { error: "Failed to create state" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new TypePartner
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if TypePartner already exists
    const existingTypePartner = await prisma.typePartner.findUnique({
      where: { name: body.name },
    });
    if (existingTypePartner) {
      return NextResponse.json(
        { message: "TypePartner with this name already exists" },
        { status: 409 },
      );
    }

    // Create new TypePartner
    const newTypePartner = await prisma.typePartner.create({
      data: { name: body.name },
    });

    return NextResponse.json(
      {
        message: "TypePartner created successfully",
        typePartner: newTypePartner,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to create TypePartner" },
      { status: 500 },
    );
  }
}

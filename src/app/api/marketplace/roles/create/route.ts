import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Invalid request: 'name' is required." },
        { status: 400 },
      );
    }

    // Check if the role with the given name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json(
        { message: `Role with name '${name}' already exists.` },
        { status: 400 },
      );
    }

    // Create the new role
    const newRole = await prisma.role.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      { message: "Role created successfully", role: newRole },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new agent
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the agent already exists by username or email
    const existingAgent = await prisma.agent.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { message: "Agent with this username or email already exists" },
        { status: 409 },
      );
    }

    // Hash the password before storing it
    const hashedPassword = await hash(body.password, 10);

    // Create the agent in the database
    const newAgent = await prisma.agent.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword, // Store hashed password
        roleId: body.roleId,
        isActive: body.isActive ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(
      { message: "Agent created successfully", agent: newAgent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 },
    );
  }
}

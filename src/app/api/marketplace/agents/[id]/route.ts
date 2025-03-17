import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // Install bcryptjs if not already installed

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single agent by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const agent = await prisma.agent.findUnique({ where: { id } });

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Agent retrieved successfully", agent },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to retrieve agent" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update an agent's details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Hash new password if provided
    let updatedData = { ...body };
    if (body.password) {
      updatedData.password = await hash(body.password, 10);
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      { message: "Agent updated successfully", agent: updatedAgent },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove an agent by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await prisma.agent.delete({ where: { id } });

    return NextResponse.json(
      { message: "Agent deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 },
    );
  }
}

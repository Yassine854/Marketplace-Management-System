// app/api/statuses/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single status by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const status = await prisma.status.findUnique({
      where: { id },
      include: {
        orders: true,
        state: true,
      },
    });

    if (!status) {
      return NextResponse.json(
        { message: "Status not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Status retrieved successfully", status },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching status:", error);
    return NextResponse.json(
      { error: "Failed to retrieve status" },
      { status: 500 },
    );
  }
}

// PATCH: Update a status's details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedStatus = await prisma.status.update({
      where: { id },
      data: {
        name: body.name,
        stateId: body.stateId,
      },
    });

    return NextResponse.json(
      { message: "Status updated successfully", status: updatedStatus },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a status by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.status.delete({ where: { id } });

    return NextResponse.json(
      { message: "Status deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting status:", error);
    return NextResponse.json(
      { error: "Failed to delete status" },
      { status: 500 },
    );
  }
}

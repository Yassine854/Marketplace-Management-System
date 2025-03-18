// app/api/taxes/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single tax by ID
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

    const tax = await prisma.tax.findUnique({ where: { id } });

    if (!tax) {
      return NextResponse.json({ message: "Tax not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Tax retrieved successfully", tax },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching tax:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tax" },
      { status: 500 },
    );
  }
}

// PATCH: Update a tax's details
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

    const updatedTax = await prisma.tax.update({
      where: { id },
      data: {
        value: body.value,
      },
    });

    return NextResponse.json(
      { message: "Tax updated successfully", tax: updatedTax },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating tax:", error);
    return NextResponse.json(
      { error: "Failed to update tax" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a tax by ID
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

    await prisma.tax.delete({ where: { id } });

    return NextResponse.json(
      { message: "Tax deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting tax:", error);
    return NextResponse.json(
      { error: "Failed to delete tax" },
      { status: 500 },
    );
  }
}

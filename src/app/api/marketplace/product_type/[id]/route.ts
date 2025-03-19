import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single ProductType by ID
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

    const productType = await prisma.productType.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!productType) {
      return NextResponse.json(
        { message: "ProductType not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "ProductType retrieved successfully", productType },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductType:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductType" },
      { status: 500 },
    );
  }
}

// PATCH: Update a ProductType's details
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

    const updatedProductType = await prisma.productType.update({
      where: { id },
      data: {
        type: body.type,
      },
    });

    return NextResponse.json(
      {
        message: "ProductType updated successfully",
        productType: updatedProductType,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating ProductType:", error);
    return NextResponse.json(
      { error: "Failed to update ProductType" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a ProductType by ID
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

    await prisma.productType.delete({ where: { id } });

    return NextResponse.json(
      { message: "ProductType deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting ProductType:", error);
    return NextResponse.json(
      { error: "Failed to delete ProductType" },
      { status: 500 },
    );
  }
}

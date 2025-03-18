// app/api/productStatuses/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single ProductStatus by ID with related Products
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

    const productStatus = await prisma.productStatus.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!productStatus) {
      return NextResponse.json(
        { message: "ProductStatus not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "ProductStatus retrieved successfully", productStatus },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductStatus" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a ProductStatus by ID
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

    // Update the ProductStatus
    const updatedProductStatus = await prisma.productStatus.update({
      where: { id },
      data: body, // Update with the provided body fields
    });

    return NextResponse.json(
      {
        message: "ProductStatus updated successfully",
        productStatus: updatedProductStatus,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to update ProductStatus" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a ProductStatus by ID
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

    // Delete the ProductStatus
    await prisma.productStatus.delete({ where: { id } });

    return NextResponse.json(
      { message: "ProductStatus deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to delete ProductStatus" },
      { status: 500 },
    );
  }
}

// app/api/productCategories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a product-category by ID
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

    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        product: true, // Include related product details
        category: true, // Include related category details
      },
    });

    if (!productCategory) {
      return NextResponse.json(
        { message: "ProductCategory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "ProductCategory retrieved successfully", productCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching productCategory:", error);
    return NextResponse.json(
      { error: "Failed to retrieve productCategory" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a product-category by ID
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

    const updatedProductCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        productId: body.productId,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "ProductCategory updated successfully",
        productCategory: updatedProductCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating productCategory:", error);
    return NextResponse.json(
      { error: "Failed to update productCategory" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a product-category by ID
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

    // Delete the productCategory by ID
    await prisma.productCategory.delete({ where: { id } });

    return NextResponse.json(
      { message: "ProductCategory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting productCategory:", error);
    return NextResponse.json(
      { error: "Failed to delete productCategory" },
      { status: 500 },
    );
  }
}

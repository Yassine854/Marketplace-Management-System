// app/api/subCategories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a subcategory by ID
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

    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true, // Include related category details
      },
    });

    if (!subCategory) {
      return NextResponse.json(
        { message: "SubCategory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SubCategory retrieved successfully", subCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching subCategory:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subCategory" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a subcategory by ID
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

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name: body.name,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "SubCategory updated successfully",
        subCategory: updatedSubCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating subCategory:", error);
    return NextResponse.json(
      { error: "Failed to update subCategory" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a subcategory by ID
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

    // Delete the subCategory by ID
    await prisma.subCategory.delete({ where: { id } });

    return NextResponse.json(
      { message: "SubCategory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting subCategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subCategory" },
      { status: 500 },
    );
  }
}

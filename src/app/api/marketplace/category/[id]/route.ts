// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile, unlink } from "fs/promises"; // For file operations
import path from "path";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single category by ID with related products and subcategories
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

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true, // Include related subcategories
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Category retrieved successfully", category },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to retrieve category" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a category by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await req.formData();
    const nameCategory = formData.get("nameCategory") as string;
    const isActive = formData.get("isActive") === "true";

    const imageFile = formData.get("image") as File | null;

    // Find the existing category
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    let imageUrl: string | null = existingCategory.image; // Default to existing image URL

    if (imageFile) {
      // Ensure file is an image
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 },
        );
      }

      // Delete the old image file if it exists
      if (existingCategory.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingCategory.image,
        );
        try {
          await unlink(oldImagePath); // Remove the old image file
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Save the new image
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`; // Public URL for the new image
    }

    // Update category with the new name and image URL
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        nameCategory,
        isActive,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      { message: "Category updated successfully", category: updatedCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a category by ID
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

    // Find the category to delete
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    // Delete the image file if it exists
    if (category.image) {
      const imagePath = path.join(process.cwd(), "public", category.image);
      try {
        await unlink(imagePath); // Remove the image file
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}

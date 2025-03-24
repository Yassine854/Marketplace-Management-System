// app/api/sub_category/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile, unlink } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single subcategory by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const subcategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true, // Include parent category details
        productSubCategories: true, // Include related products if needed
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Subcategory retrieved successfully",
        subcategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subcategory" },
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
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required field
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Find existing subcategory
    const existingSubcategory = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 },
      );
    }

    let imageUrl: string | null = existingSubcategory.image;

    // Handle image update
    if (imageFile) {
      // Validate image type
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

      // Delete old image if exists
      if (existingSubcategory.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingSubcategory.image,
        );
        try {
          await unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Save new image
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // Update subcategory
    const updatedSubcategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(
      {
        message: "Subcategory updated successfully",
        subcategory: updatedSubcategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
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
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find subcategory to delete
    const subcategory = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!subcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 },
      );
    }

    // Delete associated image
    if (subcategory.image) {
      const imagePath = path.join(process.cwd(), "public", subcategory.image);
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    // Delete subcategory
    await prisma.subCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Subcategory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 },
    );
  }
}

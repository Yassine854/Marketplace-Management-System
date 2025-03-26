import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string; // Must be a valid ObjectId
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;

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

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`; // Public URL for the stored image
    }

    // Create new subcategory in Prisma
    const newSubCategory = await prisma.subCategory.create({
      data: {
        name,
        categoryId,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(
      {
        message: "SubCategory created successfully",
        subCategory: newSubCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 },
    );
  }
}

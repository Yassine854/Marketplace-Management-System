import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const formData = await req.formData();

    const nameCategory = formData.get("nameCategory") as string;

    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!nameCategory) {
      return NextResponse.json(
        { error: "Category name is required" },
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
    const isActive = formData.get("isActive") === "true";

    const newCategory = await prisma.category.create({
      data: {
        nameCategory,
        image: imageUrl,
        isActive: isActive,
      },
    });

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}

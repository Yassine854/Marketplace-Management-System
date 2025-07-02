// app/api/marketplace/brand/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single brand by ID with related Product
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

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Brand retrieved successfully", brand },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to retrieve brand" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a brand by ID
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
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    // Get existing brand
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: { img?: string; name?: string | null } = {};

    // Update name if provided
    if (name !== null) {
      updateData.name = name;
    }

    // Handle image update if provided
    if (imageFile) {
      // Save the new image
      const brandsDir = path.join(process.cwd(), "public/uploads/brands");
      await fs.promises.mkdir(brandsDir, { recursive: true });

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `brand-${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(brandsDir, fileName);

      await writeFile(uploadPath, buffer);
      updateData.img = `/uploads/brands/${fileName}`;

      // Delete old image if it exists
      if (existingBrand.img && existingBrand.img.startsWith("/uploads/")) {
        try {
          const oldImagePath = path.join(
            process.cwd(),
            "public",
            existingBrand.img,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error("Error deleting old brand image:", error);
          // Continue with update even if deleting old file fails
        }
      }
    }

    // Update the brand
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Brand updated successfully", brand: updatedBrand },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a brand by ID
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

    // Get the brand to delete (so we can delete the image file)
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Delete the image file if it exists
    if (brand.img && brand.img.startsWith("/uploads/")) {
      try {
        const imagePath = path.join(process.cwd(), "public", brand.img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error("Error deleting brand image file:", error);
        // Continue with deletion even if file deletion fails
      }
    }

    // Delete the brand from database
    await prisma.brand.delete({ where: { id } });

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 },
    );
  }
}

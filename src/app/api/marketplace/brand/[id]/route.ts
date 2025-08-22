// app/api/marketplace/brand/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { supabase } from "@/libs/supabase/supabaseClient";

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

      // Delete old image from Supabase if it exists
      if (existingBrand.img) {
        const oldImagePath = existingBrand.img.split("/").slice(-2).join("/"); // Get "brands/filename.ext"
        try {
          await supabase.storage.from("marketplace").remove([oldImagePath]);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image to Supabase
      const buffer = await imageFile.arrayBuffer();
      const fileName = `brand-${Date.now()}-${imageFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      const { data, error } = await supabase.storage
        .from("marketplace")
        .upload(`brands/${fileName}`, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (error) {
        console.error("Error uploading to Supabase:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 },
        );
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("marketplace")
        .getPublicUrl(`brands/${fileName}`);

      updateData.img = publicUrl;
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

    // Delete the image from Supabase if it exists
    if (brand.img) {
      try {
        const imagePath = brand.img.split("/").slice(-2).join("/"); // Get "brands/filename.ext"
        await supabase.storage.from("marketplace").remove([imagePath]);
      } catch (error) {
        console.error("Error deleting brand image from Supabase:", error);
        // Continue with the deletion even if deleting the file fails
      }
    }

    // Delete the brand from database
    await prisma.brand.delete({
      where: { id },
    });

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

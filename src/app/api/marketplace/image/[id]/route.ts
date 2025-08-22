// app/api/images/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { supabase } from "@/libs/supabase/supabaseClient";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single image by ID with related Product
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

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Image retrieved successfully", image },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to retrieve image" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update an image by ID
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

    // Get existing image
    const existingImage = await prisma.image.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    let imageUrl = existingImage.url;
    const newImageFile = formData.get("image") as File | null;

    if (newImageFile) {
      // Validate file type
      const validMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validMimeTypes.includes(newImageFile.type)) {
        return NextResponse.json(
          { error: "Invalid image file type" },
          { status: 400 },
        );
      }

      // Delete old image from Supabase if it exists
      if (existingImage.url) {
        const oldImagePath = existingImage.url.split("/").slice(-2).join("/");
        await supabase.storage
          .from("marketplace")
          .remove([oldImagePath])
          .catch((error) => console.error("Error deleting old image:", error));
      }

      // Upload new image
      const buffer = await newImageFile.arrayBuffer();
      const fileName = `${Date.now()}-${newImageFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      const { data, error } = await supabase.storage
        .from("marketplace")
        .upload(`products/${fileName}`, buffer, {
          contentType: newImageFile.type,
          upsert: false,
        });

      if (error) {
        console.error("Error uploading image:", error);
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
        .getPublicUrl(`products/${fileName}`);

      imageUrl = publicUrl;
    }

    // Update the image in database
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        url: imageUrl,
        altText: (formData.get("altText") as string) ?? null,
        productId:
          (formData.get("productId") as string) || existingImage.productId,
      },
    });

    return NextResponse.json(
      { message: "Image updated successfully", image: updatedImage },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove an image by ID
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

    // Get the image to delete
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    // Delete the image from Supabase storage
    if (image.url) {
      const imagePath = image.url.split("/").slice(-2).join("/");
      await supabase.storage
        .from("marketplace")
        .remove([imagePath])
        .catch((error) =>
          console.error("Error deleting image from storage:", error),
        );
    }

    // Delete the image record from the database
    await prisma.image.delete({ where: { id } });

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

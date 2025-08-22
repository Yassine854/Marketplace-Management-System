import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { supabase } from "@/libs/supabase/supabaseClient";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Brand image is required" },
        { status: 400 },
      );
    }

    // Upload the image to Supabase storage
    const buffer = await imageFile.arrayBuffer();
    const fileName = `brand-${Date.now()}-${imageFile.name.replace(
      /\s+/g,
      "-",
    )}`;

    const { data, error } = await supabase.storage
      .from("marketplace")
      .upload(`brands/${fileName}`, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Error uploading brand image:", error);
      return NextResponse.json(
        { error: "Failed to upload brand image" },
        { status: 500 },
      );
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("marketplace").getPublicUrl(`brands/${fileName}`);

    const imageUrl = publicUrl;

    // Create the brand in database
    const brand = await prisma.brand.create({
      data: {
        img: imageUrl,
        name: name || null,
      },
    });

    return NextResponse.json(
      { message: "Brand created successfully", brand },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 },
    );
  }
}

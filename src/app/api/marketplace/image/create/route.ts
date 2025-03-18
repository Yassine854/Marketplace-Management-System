// app/api/images/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟡 POST: Create a new image
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Create a new image in the database
    const newImage = await prisma.image.create({
      data: {
        url: body.url,
        altText: body.altText ?? null, // Alt text is optional
        productId: body.productId,
      },
    });

    return NextResponse.json(
      { message: "Image created successfully", image: newImage },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 },
    );
  }
}

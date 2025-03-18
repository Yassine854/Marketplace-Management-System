import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new favorite product
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the favorite product already exists for the given customer and product
    const existingFavoriteProduct = await prisma.favoriteProduct.findUnique({
      where: {
        customerId_productId: {
          customerId: body.customerId,
          productId: body.productId,
        },
      },
    });

    if (existingFavoriteProduct) {
      return NextResponse.json(
        { message: "This favorite product already exists" },
        { status: 409 },
      );
    }

    // Create the new favorite product
    const newFavoriteProduct = await prisma.favoriteProduct.create({
      data: {
        customerId: body.customerId,
        productId: body.productId,
      },
    });

    return NextResponse.json(
      {
        message: "Favorite product created successfully",
        favoriteProduct: newFavoriteProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating favorite product:", error);
    return NextResponse.json(
      { error: "Failed to create favorite product" },
      { status: 500 },
    );
  }
}

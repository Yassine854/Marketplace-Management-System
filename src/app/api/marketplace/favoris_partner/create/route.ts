import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new favorite partner
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the favorite partner already exists for the given customer, product, and partner
    const existingFavoritePartner = await prisma.favoritePartner.findUnique({
      where: {
        customerId_productId_partnerId: {
          customerId: body.customerId,
          productId: body.productId,
          partnerId: body.partnerId,
        },
      },
    });

    if (existingFavoritePartner) {
      return NextResponse.json(
        { message: "This favorite partner already exists" },
        { status: 409 },
      );
    }

    // Create the new favorite partner
    const newFavoritePartner = await prisma.favoritePartner.create({
      data: {
        customerId: body.customerId,
        productId: body.productId,
        partnerId: body.partnerId,
      },
    });

    return NextResponse.json(
      {
        message: "Favorite partner created successfully",
        favoritePartner: newFavoritePartner,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to create favorite partner" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all favorite products with their related customer and product data
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const favoriteProducts = await prisma.favoriteProduct.findMany({
      include: {
        customers: true,
        product: true,
      },
    });

    if (favoriteProducts.length === 0) {
      return NextResponse.json(
        { message: "No favorite products found", favoriteProducts: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Favorite products retrieved successfully", favoriteProducts },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite products" },
      { status: 500 },
    );
  }
}

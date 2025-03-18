// app/api/productCategories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all product-categories
export async function GET() {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productCategories = await prisma.productCategory.findMany({
      include: {
        product: true, // Include related product details
        category: true, // Include related category details
      },
    });

    return NextResponse.json(
      {
        message: "ProductCategories retrieved successfully",
        productCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching productCategories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve productCategories" },
      { status: 500 },
    );
  }
}

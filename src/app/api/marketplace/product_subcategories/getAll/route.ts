// app/api/productSubCategory/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all product-categories
export async function GET() {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const productSubCategory = await prisma.productSubCategory.findMany({
      include: {
        product: true,
        subcategory: true,
      },
    });

    return NextResponse.json(
      {
        message: "productSubCategory retrieved successfully",
        productSubCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching productSubCategory:", error);
    return NextResponse.json(
      { error: "Failed to retrieve productSubCategory" },
      { status: 500 },
    );
  }
}

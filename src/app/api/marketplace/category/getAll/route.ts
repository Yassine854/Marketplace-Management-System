// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all categories with related products and subcategories
export async function GET() {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
    });

    return NextResponse.json(
      { message: "Categories retrieved successfully", categories },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve categories" },
      { status: 500 },
    );
  }
}

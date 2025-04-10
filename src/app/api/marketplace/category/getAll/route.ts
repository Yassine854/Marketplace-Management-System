// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
      orderBy: {
        nameCategory: "asc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

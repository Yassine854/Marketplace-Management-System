// app/api/subCategories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟡 POST: Create a new subcategory
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newSubCategory = await prisma.subCategory.create({
      data: {
        name: body.name,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "SubCategory created successfully",
        subCategory: newSubCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subCategory:", error);
    return NextResponse.json(
      { error: "Failed to create subCategory" },
      { status: 500 },
    );
  }
}

// app/api/productCategories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();
// 🟡 POST: Create a new product-category
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newProductCategory = await prisma.productCategory.create({
      data: {
        productId: body.productId,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "ProductCategory created successfully",
        productCategory: newProductCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating productCategory:", error);
    return NextResponse.json(
      { error: "Failed to create productCategory" },
      { status: 500 },
    );
  }
}

// app/api/productStatuses/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new ProductStatus
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the product status already exists by name
    const existingProductStatus = await prisma.productStatus.findUnique({
      where: { name: body.name },
    });

    if (existingProductStatus) {
      return NextResponse.json(
        { message: "Product status with this name already exists" },
        { status: 409 },
      );
    }

    // Create the new ProductStatus
    const newProductStatus = await prisma.productStatus.create({
      data: {
        name: body.name,
        actif: body.actif ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(
      {
        message: "Product status created successfully",
        productStatus: newProductStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to create ProductStatus" },
      { status: 500 },
    );
  }
}

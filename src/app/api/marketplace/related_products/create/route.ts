import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new related product
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if the relationship already exists
    const existingRelationship = await prisma.relatedProduct.findFirst({
      where: {
        productId: body.productId,
        relatedProductId: body.relatedProductId,
      },
    });

    // If it already exists, return success without creating a duplicate
    if (existingRelationship) {
      return NextResponse.json(
        {
          message: "Related product relationship already exists",
          relatedProduct: existingRelationship,
        },
        { status: 200 },
      );
    }

    // Create new relationship only if it doesn't exist
    const newRelatedProduct = await prisma.relatedProduct.create({
      data: {
        productId: body.productId,
        relatedProductId: body.relatedProductId,
      },
    });

    return NextResponse.json(
      { message: "Related product created", relatedProduct: newRelatedProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating related product:", error);
    return NextResponse.json(
      { error: "Failed to create related product" },
      { status: 500 },
    );
  }
}

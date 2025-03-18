// app/api/productTypes/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new ProductType
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Create the ProductType in the database
    const newProductType = await prisma.productType.create({
      data: {
        type: body.type,
      },
    });

    return NextResponse.json(
      {
        message: "ProductType created successfully",
        productType: newProductType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductType:", error);
    return NextResponse.json(
      { error: "Failed to create ProductType" },
      { status: 500 },
    );
  }
}

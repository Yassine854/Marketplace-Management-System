// app/api/productStatuses/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all ProductStatuses with related Products
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productStatuses = await prisma.productStatus.findMany({
      include: {
        products: true, // Include related products
      },
    });

    if (productStatuses.length === 0) {
      return NextResponse.json(
        { message: "No ProductStatuses found", productStatuses: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "ProductStatuses retrieved successfully", productStatuses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductStatuses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductStatuses" },
      { status: 500 },
    );
  }
}

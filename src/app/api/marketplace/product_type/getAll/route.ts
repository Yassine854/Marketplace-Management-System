// app/api/productTypes/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all ProductTypes
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productTypes = await prisma.productType.findMany({
      include: {
        products: true,
      },
    }); // Retrieve all ProductTypes

    if (productTypes.length === 0) {
      return NextResponse.json(
        { message: "No ProductTypes found", productTypes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "ProductTypes retrieved successfully", productTypes },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductTypes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductTypes" },
      { status: 500 },
    );
  }
}

// app/api/images/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all brands with related Product
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const brands = await prisma.brand.findMany({
      include: {
        products: true,
      },
    });

    if (brands.length === 0) {
      return NextResponse.json(
        { message: "No brands found", brands: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Brands retrieved successfully", brands },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to retrieve brands" },
      { status: 500 },
    );
  }
}

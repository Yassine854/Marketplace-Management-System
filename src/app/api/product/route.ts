// app/api/products/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const warehouseId = searchParams.get("warehouseId");

  if (!supplierId || !warehouseId) {
    return NextResponse.json(
      { error: "Missing required parameters: supplierId and warehouseId" },
      { status: 400 },
    );
  }

  try {
    const products = await prisma.products.findMany({
      where: {
        manufacturer: String(supplierId),
        website_ids: {
          has: Number(warehouseId),
        },
      },
      include: {
        stock_item: true,
      },
    });
    console.log("products", products);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

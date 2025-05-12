import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { auth } from "../../../../../services/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json(
        { message: "Search query is required", products: [] },
        { status: 400 },
      );
    }

    // Search for products by barcode or SKU
    const products = await prismaClient.product.findMany({
      where: {
        OR: [
          { barcode: { equals: query } },
          { sku: { equals: query } },
          { barcode: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        productType: true,
        productStatus: true,
        supplier: true,
        tax: true,
        promotion: true,
        images: true,
        productSubCategories: {
          include: {
            subcategory: true,
          },
        },
        relatedProducts: {
          include: {
            relatedProduct: true,
          },
        },
        typePcb: true,
        skuPartners: true,
      },
      take: 5, // Limit results
    });

    return NextResponse.json(
      { message: "Products found", products },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}

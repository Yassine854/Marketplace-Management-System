import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all products with related entities
export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const products = await prisma.product.findMany({
      include: {
        productType: true,
        productStatus: true,
        supplier: true,
        tax: true,
        promotion: true,
        images: true,
        productSubCategories: { include: { subcategory: true } },
        favoriteProducts: true,
        favoritePartners: true,
        relatedProducts: { include: { relatedProduct: true } },
        skuPartners: true,
      },
    });

    return NextResponse.json(
      { message: "Products retrieved", products },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 },
    );
  }
}

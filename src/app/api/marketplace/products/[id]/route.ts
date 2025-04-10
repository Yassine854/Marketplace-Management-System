import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a product by ID (with includes)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product retrieved", product },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to retrieve product" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a product by ID

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Separate relationships and non-prisma fields from main product data
    const {
      subCategories,
      relatedProducts,
      images, // Remove images from update payload
      ...productData
    } = body;

    // Validate required fields
    if (!productData.name || !productData.sku || !productData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Convert numeric fields
    const numericFields = {
      price: Number(productData.price),
      cost: productData.cost ? Number(productData.cost) : undefined,
      stock: productData.stock ? Number(productData.stock) : undefined,
      weight: productData.weight ? Number(productData.weight) : undefined,
      minimumQte: productData.minimumQte
        ? Number(productData.minimumQte)
        : undefined,
      maximumQte: productData.maximumQte
        ? Number(productData.maximumQte)
        : undefined,
      sealable: productData.sealable ? Number(productData.sealable) : undefined,
      alertQte: productData.alertQte ? Number(productData.alertQte) : undefined,
      loyaltyPoints: productData.loyaltyPoints
        ? Number(productData.loyaltyPoints)
        : undefined,
      loyaltyPointsAmount: productData.loyaltyPointsAmount
        ? Number(productData.loyaltyPointsAmount)
        : undefined,
    };

    // Update main product data
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...numericFields,
        // Handle images separately if needed
      },
    });

    // Update relationships in transaction
    await prisma.$transaction(async (tx) => {
      if (subCategories) {
        await tx.productSubCategory.deleteMany({
          where: { productId: id },
        });

        if (subCategories.length > 0) {
          await tx.productSubCategory.createMany({
            data: subCategories.map((sc: string) => ({
              productId: id,
              subcategoryId: sc,
            })),
          });
        }
      }

      if (relatedProducts) {
        await tx.relatedProduct.deleteMany({
          where: { productId: id },
        });

        if (relatedProducts.length > 0) {
          await tx.relatedProduct.createMany({
            data: relatedProducts.map((rp: string) => ({
              productId: id,
              relatedProductId: rp,
            })),
          });
        }
      }
    });

    // Get updated product with relationships
    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        productSubCategories: true,
        relatedProducts: true,
      },
    });

    return NextResponse.json(
      { message: "Product updated", product: fullProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle Prisma errors
    let errorMessage = "Failed to update product";
    if (error instanceof Error) {
      errorMessage = error.message.includes("prisma")
        ? "Database error occurred"
        : error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
// 🔴 DELETE: Remove a product by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

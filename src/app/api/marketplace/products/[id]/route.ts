import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// Helper function to check if user is KamiounAdminMaster
async function isKamiounAdminMaster(mRoleId: string) {
  const userRole = await prisma.role.findUnique({
    where: { id: mRoleId },
  });
  return userRole?.name === "KamiounAdminMaster";
}

// Helper function to check permissions
async function checkPermission(mRoleId: string, requiredAction: string) {
  // First check if user is KamiounAdminMaster
  if (await isKamiounAdminMaster(mRoleId)) {
    return true;
  }

  // Otherwise check specific permissions
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId: mRoleId },
    include: { permission: true },
  });

  return rolePermissions.some(
    (rp) =>
      rp.permission?.resource === "Product" &&
      rp.actions.includes(requiredAction),
  );
}

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

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    const hasPermission = await checkPermission(user.mRoleId, "read");
    if (!hasPermission) {
      return NextResponse.json(
        { message: "Forbidden: missing 'read' permission for Product" },
        { status: 403 },
      );
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

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    const hasPermission = await checkPermission(user.mRoleId, "update");
    if (!hasPermission) {
      return NextResponse.json(
        { message: "Forbidden: missing 'update' permission for Product" },
        { status: 403 },
      );
    }

    const { id } = params;
    const body = await req.json();

    // Special case for just accepting a product
    if (body.accepted === true && Object.keys(body).length === 1) {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { accepted: true },
      });

      return NextResponse.json(
        { message: "Product accepted", product: updatedProduct },
        { status: 200 },
      );
    }

    // Regular update flow continues below
    const { subCategories, relatedProducts, images, ...productData } = body;

    if (!productData.name || !productData.sku || !productData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Handle barcode - convert null/undefined to empty string to maintain uniqueness
    const barcode = productData.barcode || "";

    // Only check for duplicate barcode if it's not an empty string
    if (barcode !== "") {
      const existingProductWithBarcode = await prisma.product.findFirst({
        where: {
          barcode,
          id: { not: id },
        },
      });

      if (existingProductWithBarcode) {
        return NextResponse.json(
          { message: "Barcode already exists" },
          { status: 400 },
        );
      }
    }

    // Check if SKU already exists (excluding the current product)
    const sku = productData.sku;
    if (sku) {
      const existingProductWithSku = await prisma.product.findFirst({
        where: {
          sku,
          id: { not: id }, // Exclude the current product from the check
        },
      });

      if (existingProductWithSku) {
        return NextResponse.json(
          { message: "SKU already exists" },
          { status: 400 },
        );
      }
    }

    // Update productData with the processed barcode
    productData.barcode = barcode;

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
      loyaltyPointsPerProduct: productData.loyaltyPointsPerProduct
        ? Number(productData.loyaltyPointsPerProduct)
        : undefined,
      loyaltyPointsPerUnit: productData.loyaltyPointsPerUnit
        ? Number(productData.loyaltyPointsPerUnit)
        : undefined,
      loyaltyPointsBonusQuantity: productData.loyaltyPointsBonusQuantity
        ? Number(productData.loyaltyPointsBonusQuantity)
        : undefined,
      loyaltyPointsThresholdQty: productData.loyaltyPointsThresholdQty
        ? Number(productData.loyaltyPointsThresholdQty)
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

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    const hasPermission = await checkPermission(user.mRoleId, "delete");
    if (!hasPermission) {
      return NextResponse.json(
        { message: "Forbidden: missing 'delete' permission for Product" },
        { status: 403 },
      );
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

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new product
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        product_id: body.product_id,
        sku: body.sku,
        name: body.name,
        price: body.price,
        special_price: body.special_price,
        cost: body.cost,
        manufacturer: body.manufacturer,
        category_ids: body.category_ids,
        website_ids: body.website_ids,
        image: body.image,
        url_key: body.url_key,
        created_at: body.created_at,
        updated_at: body.updated_at,
        stock: body.stock,
        promo: body.promo,
        minimumQte: body.minimumQte,
        maximumQte: body.maximumQte,
        typePcbId: body.typePcbId,
        productTypeId: body.productTypeId,
        productStatusId: body.productStatusId,
        supplierId: body.supplierId,
        taxId: body.taxId,
        promotionId: body.promotionId,
      },
    });

    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

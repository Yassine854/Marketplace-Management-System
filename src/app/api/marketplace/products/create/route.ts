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

    // 🟢 Handle FormData instead of req.json()
    const formData = await req.formData();

    const timestamp = Date.now();
    const randomComponent = Math.floor(Math.random() * 1000000);
    const uniqueProductId = parseInt(`${timestamp}${randomComponent}`);

    const newProduct = await prisma.product.create({
      data: {
        product_id: uniqueProductId,
        name: formData.get("name") as string,
        sku: formData.get("sku") as string,
        price: parseFloat(formData.get("price") as string),
        cost: formData.get("cost")
          ? parseFloat(formData.get("cost") as string)
          : null,
        stock: parseInt(formData.get("stock") as string),
        promo: formData.get("promo") === "true",
        minimumQte: formData.get("minimumQte")
          ? parseInt(formData.get("minimumQte") as string)
          : null,
        maximumQte: formData.get("maximumQte")
          ? parseInt(formData.get("maximumQte") as string)
          : null,
        sealable: formData.get("sealable")
          ? parseInt(formData.get("sealable") as string)
          : null,

        alertQte: formData.get("alertQte")
          ? parseInt(formData.get("alertQte") as string)
          : null,
        loyaltyPoints: formData.get("loyaltyPoints")
          ? parseFloat(formData.get("loyaltyPoints") as string)
          : null,
        loyaltyPointsAmount: formData.get("loyaltyPointsAmount")
          ? parseFloat(formData.get("loyaltyPointsAmount") as string)
          : null,
        pcb: formData.get("pcb") as string,
        weight: formData.get("weight")
          ? parseFloat(formData.get("weight") as string)
          : null,
        description: formData.get("description")
          ? (formData.get("description") as string)
          : null,
        typePcbId: formData.get("typePcbId") as string,
        productTypeId: formData.get("productTypeId") as string,
        productStatusId: formData.get("productStatusId") as string,
        supplierId: formData.get("supplierId") as string,
        taxId: formData.get("taxId") as string,
        promotionId:
          formData.get("promo") === "true" && formData.get("promotionId")
            ? (formData.get("promotionId") as string)
            : null,
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

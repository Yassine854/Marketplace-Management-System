// app/api/skupartner/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (
      !body.productId ||
      !body.partnerId ||
      !body.skuPartner ||
      !body.skuProduct
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newSkuPartner = await prisma.skuPartner.create({
      data: {
        productId: body.productId,
        partnerId: body.partnerId,
        skuPartner: body.skuPartner,
        skuProduct: body.skuProduct,
      },
    });

    return NextResponse.json(
      { message: "SkuPartner created successfully", skuPartner: newSkuPartner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating SkuPartner:", error);
    return NextResponse.json(
      { error: "Failed to create SkuPartner" },
      { status: 500 },
    );
  }
}

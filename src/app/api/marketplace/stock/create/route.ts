// app/api/marketplace/stock/create/route.ts
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

    console.log("Stock creation request body:", body);

    // Validate required fields
    if (!body.skuPartnerId) {
      return NextResponse.json(
        { message: "skuPartnerId is required" },
        { status: 400 },
      );
    }

    if (!body.sourceId) {
      return NextResponse.json(
        { message: "sourceId is required" },
        { status: 400 },
      );
    }

    if (body.stockQuantity === undefined || body.stockQuantity === null) {
      return NextResponse.json(
        { message: "stockQuantity is required" },
        { status: 400 },
      );
    }

    if (body.minQty === undefined || body.minQty === null) {
      return NextResponse.json(
        { message: "minQty is required" },
        { status: 400 },
      );
    }

    if (body.maxQty === undefined || body.maxQty === null) {
      return NextResponse.json(
        { message: "maxQty is required" },
        { status: 400 },
      );
    }

    if (!body.price || body.price <= 0) {
      return NextResponse.json(
        { message: "Valid price is required" },
        { status: 400 },
      );
    }

    // Check if a stock entry with this skuPartnerId and sourceId combination already exists
    const existingStock = await prisma.stock.findFirst({
      where: {
        skuPartnerId: body.skuPartnerId,
        sourceId: body.sourceId,
      },
    });

    if (existingStock) {
      return NextResponse.json(
        {
          message: "Stock entry already exists for this SKU partner and source",
        },
        { status: 409 },
      );
    }

    // Verify that the skuPartnerId exists
    const skuPartner = await prisma.skuPartner.findUnique({
      where: { id: body.skuPartnerId },
    });

    if (!skuPartner) {
      return NextResponse.json(
        { message: "SKU Partner not found" },
        { status: 404 },
      );
    }

    // Verify that the sourceId exists
    const source = await prisma.source.findUnique({
      where: { id: body.sourceId },
    });

    if (!source) {
      return NextResponse.json(
        { message: "Source not found" },
        { status: 404 },
      );
    }

    const stockData = {
      skuPartnerId: body.skuPartnerId,
      sourceId: body.sourceId,
      stockQuantity: parseInt(body.stockQuantity),
      sealable: parseInt(body.stockQuantity),
      minQty: parseInt(body.minQty),
      maxQty: parseInt(body.maxQty),
      price: parseFloat(body.price),
      special_price: body.special_price ? parseFloat(body.special_price) : null,
      loyaltyPointsPerProduct: body.loyaltyPointsPerProduct
        ? parseInt(body.loyaltyPointsPerProduct)
        : null,
      loyaltyPointsPerUnit: body.loyaltyPointsPerUnit
        ? parseInt(body.loyaltyPointsPerUnit)
        : null,
      loyaltyPointsBonusQuantity: body.loyaltyPointsBonusQuantity
        ? parseInt(body.loyaltyPointsBonusQuantity)
        : null,
      loyaltyPointsThresholdQty: body.loyaltyPointsThresholdQty
        ? parseInt(body.loyaltyPointsThresholdQty)
        : null,
    };

    console.log("Creating stock with data:", stockData);

    const newStock = await prisma.stock.create({
      data: stockData,
    });

    console.log("Stock created successfully:", newStock);

    return NextResponse.json(
      { message: "Stock created successfully", stock: newStock },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating Stock:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            error: "Stock entry already exists for this SKU partner and source",
          },
          { status: 409 },
        );
      }
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid SKU Partner or Source reference" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create Stock. Please check your input and try again.",
      },
      { status: 500 },
    );
  }
}

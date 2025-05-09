// app/api/marketplace/stock/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const stocks = await prisma.stock.findMany({
      include: {
        skuPartner: {
          include: {
            product: true,
            partner: true,
          },
        },
        source: true,
      },
    });

    if (stocks.length === 0) {
      return NextResponse.json(
        { message: "No stocks found", stocks: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Stocks retrieved successfully", stocks },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { error: "Failed to retrieve stocks" },
      { status: 500 },
    );
  }
}

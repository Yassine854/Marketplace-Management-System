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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Page courante (par défaut 1)
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Nombre d'éléments par page (par défaut 10)

    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const promoPrice = url.searchParams.get("promoPrice");

    const filterConditions: any = {};

    if (startDate) {
      filterConditions.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      filterConditions.endDate = {
        lte: new Date(endDate),
      };
    }

    if (promoPrice) {
      filterConditions.promoPrice = {
        gte: parseFloat(promoPrice),
      };
    }

    const skip = (page - 1) * limit;

    const promotions = await prisma.promotion.findMany({
      where: filterConditions,
      skip,
      take: limit,
      include: {
        products: true,
      },
    });

    const totalPromotions = await prisma.promotion.count({
      where: filterConditions,
    });

    return NextResponse.json(
      {
        message: "Promotions retrieved successfully",
        promotions,
        totalPromotions,
        currentPage: page,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve promotions" },
      { status: 500 },
    );
  }
}

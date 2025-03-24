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
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const promoPrice = url.searchParams.get("promoPrice");
    const searchTerm = url.searchParams.get("search");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const filterConditions: any = {};

    if (promoPrice) {
      filterConditions.promoPrice = parseFloat(promoPrice);
    }

    if (searchTerm) {
      const parsedSearchTerm = new Date(searchTerm);
      if (!isNaN(parsedSearchTerm.getTime())) {
        filterConditions.OR = [
          {
            promoPrice: parseFloat(searchTerm),
          },
        ];
      } else {
        filterConditions.OR = [
          {
            promoPrice: parseFloat(searchTerm),
          },
        ];
      }
    }

    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (!isNaN(parsedStartDate.getTime())) {
        filterConditions.startDate = {
          gte: parsedStartDate,
        };
      }
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (!isNaN(parsedEndDate.getTime())) {
        filterConditions.endDate = {
          lte: parsedEndDate,
        };
      }
    }

    const skip = (page - 1) * limit;

    const promotions = await prisma.promotion.findMany({
      where: filterConditions,
      skip,
      take: limit,
      include: {},
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
        totalPages: Math.ceil(totalPromotions / limit),
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

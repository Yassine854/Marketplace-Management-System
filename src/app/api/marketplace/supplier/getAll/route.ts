import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth(); // Récupérer la session de l'utilisateur

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const manufacturers = await prisma.manufacturer.findMany({
      skip,
      take: limit,
    });

    const totalManufacturers = await prisma.manufacturer.count();

    if (manufacturers.length === 0) {
      return NextResponse.json(
        {
          message: "No manufacturers found",
          manufacturers: [],
          total: totalManufacturers,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Manufacturers retrieved successfully",
        manufacturers,
        totalManufacturers,
        currentPage: page,
        totalPages: Math.ceil(totalManufacturers / limit),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve manufacturers" },
      { status: 500 },
    );
  }
}

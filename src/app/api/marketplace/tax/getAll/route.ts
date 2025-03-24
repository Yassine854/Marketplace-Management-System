import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Authenticate user
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1
    const size = parseInt(url.searchParams.get("size") || "10", 10); // Default to 10 items per page
    const searchTerm = url.searchParams.get("search") || ""; // Optional search term

    const filterConditions: any = {};

    if (searchTerm) {
      const parsedSearchTerm = parseFloat(searchTerm);
      if (!isNaN(parsedSearchTerm)) {
        filterConditions.value = parsedSearchTerm;
      } else {
        filterConditions.name = {
          contains: searchTerm, // Assuming the search term might match a 'name' field
          mode: "insensitive", // Case insensitive search
        };
      }
    }

    const skip = (page - 1) * size;

    const taxes = await prisma.tax.findMany({
      where: filterConditions,
      skip,
      take: size, // Limit number of records per page
    });

    const totalTaxes = await prisma.tax.count({
      where: filterConditions,
    });

    if (taxes.length === 0) {
      return NextResponse.json(
        { message: "No taxes found", taxes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Taxes retrieved successfully",
        taxes,
        totalTaxes,
        currentPage: page,
        totalPages: Math.ceil(totalTaxes / size), // Calculate total pages based on the total count
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve taxes" },
      { status: 500 },
    );
  }
}

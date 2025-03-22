// app/api/taxes/getAll/route.ts
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
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const size = parseInt(url.searchParams.get("size") || "10", 10);

    const taxes = await prisma.tax.findMany({
      include: {
        products: true,
        orderItems: true,
        reservationItems: true,
      },
    });

    const filteredTaxes = taxes.filter(
      (tax) => tax.value.toString().includes(search) || tax.id.includes(search),
    );

    const paginatedTaxes = filteredTaxes.slice((page - 1) * size, page * size);

    if (paginatedTaxes.length === 0) {
      return NextResponse.json(
        { message: "No taxes found", taxes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Taxes retrieved successfully",
        taxes: paginatedTaxes,
        total: filteredTaxes.length,
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

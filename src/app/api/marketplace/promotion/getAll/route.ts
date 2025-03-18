// app/api/promotions/getAll/route.ts
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

    const promotions = await prisma.promotion.findMany();

    if (promotions.length === 0) {
      return NextResponse.json(
        { message: "No promotions found", promotions: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Promotions retrieved successfully", promotions },
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

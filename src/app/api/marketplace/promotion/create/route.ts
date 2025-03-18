// app/api/promotions/create/route.ts
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

    const newPromotion = await prisma.promotion.create({
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        promoPrice: body.promoPrice,
      },
    });

    return NextResponse.json(
      { message: "Promotion created successfully", promotion: newPromotion },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 },
    );
  }
}

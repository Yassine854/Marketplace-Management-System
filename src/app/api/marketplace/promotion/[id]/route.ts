// app/api/promotions/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const promotion = await prisma.promotion.findUnique({ where: { id } });

    if (!promotion) {
      return NextResponse.json(
        { message: "Promotion not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Promotion retrieved successfully", promotion },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json(
      { error: "Failed to retrieve promotion" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        promoPrice: body.promoPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Promotion updated successfully",
        promotion: updatedPromotion,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json(
      { message: "Promotion deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 },
    );
  }
}

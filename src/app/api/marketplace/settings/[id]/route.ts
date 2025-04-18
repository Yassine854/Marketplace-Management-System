// app/api/settings/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve single Settings by ID
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

    const settings = await prisma.settings.findUnique({
      where: { id },
      include: {
        partner: true,
        schedules: true,
      },
    });

    if (!settings) {
      return NextResponse.json(
        { message: "Settings not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Settings retrieved successfully", settings },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching Settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Settings" },
      { status: 500 },
    );
  }
}

// PATCH: Update Settings
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

    const updatedSettings = await prisma.settings.update({
      where: { id },
      data: {
        deliveryType: body.deliveryType,
        deliveryTypeAmount: body.deliveryTypeAmount,
        freeDeliveryAmount: body.freeDeliveryAmount,
        loyaltyPointsAmount: body.loyaltyPointsAmount,
        loyaltyPointsUnique: body.loyaltyPointsUnique,
        partnerId: body.partnerId,
      },
    });

    return NextResponse.json(
      {
        message: "Settings updated successfully",
        settings: updatedSettings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating Settings:", error);
    return NextResponse.json(
      { error: "Failed to update Settings" },
      { status: 500 },
    );
  }
}

// DELETE: Remove Settings
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

    await prisma.settings.delete({ where: { id } });

    return NextResponse.json(
      { message: "Settings deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting Settings:", error);
    return NextResponse.json(
      { error: "Failed to delete Settings" },
      { status: 500 },
    );
  }
}

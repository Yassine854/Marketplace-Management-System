// app/api/settings/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create new Settings
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Create the Settings in the database
    const newSettings = await prisma.settings.create({
      data: {
        deliveryType: body.deliveryType,
        deliveryTypeAmount: body.deliveryTypeAmount,
        freeDeliveryAmount: body.freeDeliveryAmount,
        loyaltyPointsAmount: body.loyaltyPointsAmount,
        loyaltyPointsUnique: body.loyaltyPointsUnique,
        partnerId: body.partnerId || null,
      },
    });

    return NextResponse.json(
      {
        message: "Settings created successfully",
        settings: newSettings,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating Settings:", error);
    return NextResponse.json(
      { error: "Failed to create Settings" },
      { status: 500 },
    );
  }
}

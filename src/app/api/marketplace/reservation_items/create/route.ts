import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new reservation item
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newReservationItem = await prisma.reservationItem.create({
      data: {
        qteReserved: body.qteReserved,
        discountedPrice: body.discountedPrice,
        weight: body.weight,
        sku: body.sku,
        reservationId: body.reservationId,
        productId: body.productId,
        taxId: body.taxId,
      },
    });

    return NextResponse.json(
      {
        message: "Reservation item created",
        reservationItem: newReservationItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating reservation item:", error);
    return NextResponse.json(
      { error: "Failed to create reservation item" },
      { status: 500 },
    );
  }
}

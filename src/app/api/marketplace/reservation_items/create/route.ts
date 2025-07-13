import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
const prisma = new PrismaClient();

// 🟢 POST: Create a new reservation item
export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    if (!body.qteReserved || !body.productId || !body.customerId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (qteReserved, productId or customerId)",
        },
        { status: 400 },
      );
    }

    const newReservationItem = await prisma.reservationItem.create({
      data: {
        qteReserved: body.qteReserved,
        price: body.price || null,
        discountedPrice: body.discountedPrice || null,
        weight: body.weight || null,
        sku: body.sku || null,
        product: {
          connect: { id: body.productId },
        },
        source: {
          connect: { id: body.sourceId },
        },
        Customer: {
          connect: { id: body.customerId },
        },
        partner: {
          connect: { id: body.partnerId },
        },
        reservation: {
          connect: { id: body.reservationId },
        },
        // Do NOT include: product: body.product
      },
      include: {
        product: true,
        source: true,
        tax: true,
        Customer: true,
        partner: true,
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

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new reservation
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const existingData = await prisma.reservation.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Reservation",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Reservation",
          },
        });
      }
    }

    const newReservation = await prisma.reservation.create({
      data: {
        amountExclTaxe: body.amountExclTaxe,
        amountTTC: body.amountTTC,
        amountBeforePromo: body.amountBeforePromo,
        amountAfterPromo: body.amountAfterPromo,
        amountRefunded: body.amountRefunded,
        amountCanceled: body.amountCanceled,
        amountOrdered: body.amountOrdered,
        amountShipped: body.amountShipped,
        shippingMethod: body.shippingMethod,
        isActive: body.state || false,
        loyaltyPtsValue: body.loyaltyPtsValue || 0,
        fromMobile: body.fromMobile || false,
        weight: body.weight,
        customerId: body.customerId,
        agentId: body.agentId,
        partnerId: body.partnerId,
        orderId: body.orderId,
        paymentMethodId: body.paymentMethodId,
      },
    });

    return NextResponse.json(
      { message: "Reservation created", reservation: newReservation },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 },
    );
  }
}

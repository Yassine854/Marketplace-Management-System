import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new order
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newOrder = await prisma.order.create({
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
        loyaltyPtsValue: body.loyaltyPtsValue,
        fromMobile: body.fromMobile,
        weight: body.weight,
        statusId: body.statusId,
        stateId: body.stateId,
        customerId: body.customerId,
        agentId: body.agentId,
        reservationId: body.reservationId,
        partnerId: body.partnerId,
        paymentMethodId: body.paymentMethodId,
      },
    });

    return NextResponse.json(
      { message: "Order created", order: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

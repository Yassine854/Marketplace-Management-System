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

    const reservation = await prisma.reservation.findUnique({
      where: { id: body.reservationId },
      include: { reservationItems: true },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: `Reservation with ID ${body.reservationId} not found.` },
        { status: 404 },
      );
    }

    const stateName = body.isActive ? "Active" : "Inactive";
    const state = await prisma.state.findUnique({
      where: {
        name: stateName,
      },
    });

    if (!state) {
      return NextResponse.json(
        { error: `State with name ${stateName} not found.` },
        { status: 400 },
      );
    }

    let status = await prisma.status.findUnique({
      where: {
        name: "opened",
      },
    });

    if (!status) {
      status = await prisma.status.create({
        data: {
          name: "opened",
          stateId: state.id,
        },
      });
    }
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
        statusId: status.id,
        stateId: state.id,
        customerId: body.customerId,
        agentId: body.agentId,
        reservationId: body.reservationId,
        partnerId: body.partnerId,
        paymentMethodId: body.paymentMethodId,
        orderItems: {
          create: reservation.reservationItems.map((item) => ({
            qteOrdered: item.qteReserved,
            qteRefunded: 0,
            qteShipped: 0,
            qteCanceled: 0,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
            sku: item.sku,
            taxId: item.taxId,
            productId: item.productId,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(
      { message: "Order created with items", order: newOrder },
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

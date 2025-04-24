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

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.roleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Order" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Order" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.order.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Order",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Order",
          },
        });
      }
    }

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

    await prisma.reservation.update({
      where: { id: body.reservationId },

      data: { orderId: newOrder.id },
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

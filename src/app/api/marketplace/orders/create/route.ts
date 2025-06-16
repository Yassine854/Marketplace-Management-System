import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    // });

    // // Allow access if user is KamiounAdminMaster
    // const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    // if (!isKamiounAdminMaster) {
    //   if (!user.mRoleId) {
    //     return NextResponse.json({ message: "No role found" }, { status: 403 });
    //   }

    //   const rolePermissions = await prisma.rolePermission.findMany({
    //     where: {
    //       roleId: user.mRoleId,
    //     },
    //     include: {
    //       permission: true,
    //     },
    //   });

    //   const canCreate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Order" && rp.actions.includes("create"),
    //   );

    //   if (!canCreate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'create' permission for Order" },
    //       { status: 403 },
    //     );
    //   }
    // }

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

    const stateName = body.isActive ? "new" : "canceled";
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
        name: "open",
      },
    });

    if (!status) {
      status = await prisma.status.create({
        data: {
          name: "open",
          stateId: state.id,
        },
      });
    }
    const newOrder = await prisma.order.create({
      data: {
        amountTTC: body.amountTTC,
        amountRefunded: body.amountRefunded || 0,
        amountCanceled: body.amountCanceled || 0,
        amountOrdered: body.amountOrdered,
        amountShipped: body.amountShipped || 0,
        shippingMethod: body.shippingMethod,
        shippingAmount: body.shippingAmount,
        loyaltyPtsValue: body.loyaltyPtsValue || 0,
        fromMobile: body.fromMobile,
        weight: body.weight,
        isActive: body.isActive,
        status: { connect: { id: status.id } },
        state: {
          connect: { id: state.id },
        },
        paymentMethod: { connect: { id: body.paymentMethodId } },
        customer: { connect: { id: body.customerId } },
        agent: body.agentId ? { connect: { id: body.agentId } } : undefined,
        reservation: body.reservationId
          ? { connect: { id: body.reservationId } }
          : undefined,
        orderItems: {
          create: reservation.reservationItems.map((item) => ({
            qteOrdered: item.qteReserved,
            qteRefunded: 0,
            qteShipped: 0,
            qteCanceled: 0,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
            sku: item.sku,
            product: { connect: { id: item.productId } },
            source: item.sourceId
              ? { connect: { id: item.sourceId } }
              : undefined,
            partner: item.partnerId
              ? { connect: { id: item.partnerId } }
              : undefined,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            source: true,
            partner: true,
          },
        },
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

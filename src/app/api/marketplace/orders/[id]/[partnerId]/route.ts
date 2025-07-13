import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string; partnerId: string } },
) {
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
      userType?: string;
    };
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        status: true,
        state: true,
        customer: true,
        reservation: true,
        orderItems: {
          where:
            user.userType === "partner"
              ? { source: { partnerId: user.id } }
              : undefined,
          include: {
            product: true,
            state: true,
            status: true,
            source: {
              include: {
                partner: true,
              },
            },
          },
        },
        loyaltyPoints: true,
        paymentMethod: true,
      },
    });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Order retrieved", order },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; partnerId: string } },
) {
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
      userType?: string;
    };
    const { id } = params;
    const body = await req.json();

    // Update orderItems if provided
    if (Array.isArray(body.orderItems)) {
      for (const item of body.orderItems) {
        const updateData: any = {};
        if (item.stateId !== undefined) updateData.stateId = item.stateId;
        if (item.statusId !== undefined) updateData.statusId = item.statusId;
        if (item.qteOrdered !== undefined)
          updateData.qteOrdered = item.qteOrdered;
        if (Object.keys(updateData).length > 0 && item.id) {
          await prisma.orderItem.update({
            where: { id: item.id },
            data: updateData,
          });
        }
      }
    }

    // Update order fields as before
    const {
      id: _,
      createdAt,
      updatedAt,
      reservation,
      mainOrderId,
      loyaltyPoints,
      orderItems,
      ...updateData
    } = body;

    if (body.statusId) {
      updateData.status = { connect: { id: body.statusId } };
      delete updateData.statusId;
    }
    if (body.stateId) {
      updateData.state = { connect: { id: body.stateId } };
      delete updateData.stateId;
    }
    if (body.customerId) {
      updateData.customer = { connect: { id: body.customerId } };
      delete updateData.customerId;
    }
    if (body.agentId) {
      updateData.agent = { connect: { id: body.agentId } };
      delete updateData.agentId;
    }
    if (body.partnerId) {
      updateData.partner = { connect: { id: body.partnerId } };
      delete updateData.partnerId;
    }
    if (body.paymentMethodId) {
      updateData.paymentMethod = { connect: { id: body.paymentMethodId } };
      delete updateData.paymentMethodId;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        status: true,
        state: true,
        customer: true,
        reservation: true,
        orderItems: {
          include: {
            product: true,
            source: {
              include: {
                partner: true,
              },
            },
          },
        },
        loyaltyPoints: true,
        paymentMethod: true,
      },
    });

    return NextResponse.json(
      { message: "Order updated", order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canDelete = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Order" && rp.actions.includes("delete"),
    //   );

    //   if (!canDelete) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'delete' permission for Order" },
    //       { status: 403 },
    //     );
    //   }
    // }

    await prisma.orderItem.deleteMany({
      where: { orderId: params.id },
    });

    const deletedOrder = await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Order deleted successfully", order: deletedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}

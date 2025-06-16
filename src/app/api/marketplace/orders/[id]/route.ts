import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
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

    //   const canRead = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Order" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for Order" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        status: true,
        state: true,
        customer: true,
        agent: true,
        reservation: true,
        orderItems: {
          include: {
            product: true,
            source: true,
            partner: true,
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

    //   const canUpdate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Order" && rp.actions.includes("update"),
    //   );

    //   if (!canUpdate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'update' permission for Order" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const body = await req.json();

    const {
      id: _,
      createdAt,
      updatedAt,
      reservation,
      mainOrderId,
      loyaltyPoints,
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

    if (body.orderItems) {
      updateData.orderItems = {
        updateMany: body.orderItems.map((item: any) => ({
          where: { id: item.id },
          data: {
            qteOrdered: item.qteOrdered,
            qteRefunded: item.qteRefunded,
            qteShipped: item.qteShipped,
            qteCanceled: item.qteCanceled,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
            sku: item.sku,
            sourceId: item.sourceId,
            customerId: item.customerId,
            partnerId: item.partnerId,
          },
        })),
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
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

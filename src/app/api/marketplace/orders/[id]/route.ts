import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        status: true,
        state: true,
        customer: true,
        agent: true,
        reservation: true,
        partner: true,
        orderItems: true,
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    console.log("Incoming PATCH request body:", body);
    const {
      id: _,
      createdAt,
      updatedAt,
      mainOrderId,
      statusId,
      stateId,
      customerId,
      agentId,
      partnerId,
      paymentMethodId,
      reservation,
      loyaltyPoints,
      ...data
    } = body;

    if (body.status) {
      data.status = { connect: { id: body.status.id } }; // Use relation field
    }
    if (body.state) {
      data.state = { connect: { id: body.state.id } };
    }
    if (body.customer) {
      data.customer = { connect: { id: body.customer.id } };
    }
    if (body.agent) {
      data.agent = { connect: { id: body.agent.id } };
    }
    if (body.partner) {
      data.partner = { connect: { id: body.partner.id } };
    }
    if (body.paymentMethod) {
      data.paymentMethod = { connect: { id: body.paymentMethod.id } };
    }
    if (body.orderItems) {
      data.orderItems = {
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
          },
        })),
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}

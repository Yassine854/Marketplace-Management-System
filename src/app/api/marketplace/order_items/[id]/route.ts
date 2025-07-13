import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve an order item by ID
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
    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { message: "Order item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Order item retrieved", orderItem },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order item:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order item" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update an order item by ID
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

    // Only allow updating stateId, statusId, qteOrdered
    const updateData: any = {};
    if (body.stateId !== undefined) updateData.stateId = body.stateId;
    if (body.statusId !== undefined) updateData.statusId = body.statusId;
    if (body.qteOrdered !== undefined) updateData.qteOrdered = body.qteOrdered;

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Order item updated", orderItem: updatedOrderItem },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove an order item by ID
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

    await prisma.orderItem.delete({ where: { id } });

    return NextResponse.json(
      { message: "Order item deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { error: "Failed to delete order item" },
      { status: 500 },
    );
  }
}

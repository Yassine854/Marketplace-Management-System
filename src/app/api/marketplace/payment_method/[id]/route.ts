import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve an order payment by ID
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
    const orderPayment = await prisma.orderPayment.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!orderPayment) {
      return NextResponse.json(
        { message: "Order payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Order payment retrieved", orderPayment },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order payment:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order payment" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update an order payment by ID
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

    const updatedOrderPayment = await prisma.orderPayment.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "Order payment updated", orderPayment: updatedOrderPayment },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order payment:", error);
    return NextResponse.json(
      { error: "Failed to update order payment" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove an order payment by ID
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

    await prisma.orderPayment.delete({ where: { id } });

    return NextResponse.json(
      { message: "Order payment deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting order payment:", error);
    return NextResponse.json(
      { error: "Failed to delete order payment" },
      { status: 500 },
    );
  }
}

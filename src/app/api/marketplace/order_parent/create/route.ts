import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new MainOrder and link specified Orders
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderIds } = body; // Array of order IDs from request

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { message: "No valid order IDs provided" },
        { status: 400 },
      );
    }

    // Validate if all provided orders exist
    const existingOrders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
    });

    if (existingOrders.length !== orderIds.length) {
      return NextResponse.json(
        { message: "One or more orders not found" },
        { status: 404 },
      );
    }

    // Create MainOrder
    const newMainOrder = await prisma.mainOrder.create({
      data: {
        orders: {
          connect: orderIds.map((id: string) => ({ id })), // Link orders
        },
      },
      include: {
        orders: true, // Include linked orders in response
      },
    });

    // Update each Order to reference the newly created MainOrder
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { mainOrderId: newMainOrder.id },
    });

    return NextResponse.json(
      {
        message: "MainOrder created and linked successfully",
        mainOrder: newMainOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating MainOrder:", error);
    return NextResponse.json(
      { error: "Failed to create MainOrder" },
      { status: 500 },
    );
  }
}

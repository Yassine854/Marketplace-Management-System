import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all order items
export async function GET() {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mainOrders = await prisma.mainOrder.findMany({
      include: {
        orders: true, // Include related orders
      },
    });

    if (mainOrders.length === 0) {
      return NextResponse.json(
        { message: "No main orders found", mainOrders: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Main orders retrieved successfully", mainOrders },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching main orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve main orders" },
      { status: 500 },
    );
  }
}

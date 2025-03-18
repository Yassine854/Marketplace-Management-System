import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all orders with relationships
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
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

    return NextResponse.json(
      { message: "Orders retrieved", orders },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 },
    );
  }
}

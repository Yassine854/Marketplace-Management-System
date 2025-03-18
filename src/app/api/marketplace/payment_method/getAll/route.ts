import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all order payment methods
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orderPayments = await prisma.orderPayment.findMany({
      include: {
        orders: true,
        reservations: true,
      },
    });

    return NextResponse.json(
      { message: "Order payments retrieved", orderPayments },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order payments:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order payments" },
      { status: 500 },
    );
  }
}

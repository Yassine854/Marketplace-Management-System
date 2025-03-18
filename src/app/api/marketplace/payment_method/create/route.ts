import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new order payment method
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newOrderPayment = await prisma.orderPayment.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { message: "Order payment created", orderPayment: newOrderPayment },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order payment:", error);
    return NextResponse.json(
      { error: "Failed to create order payment" },
      { status: 500 },
    );
  }
}

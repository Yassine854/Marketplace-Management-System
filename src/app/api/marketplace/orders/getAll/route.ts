import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);

    const offset = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      include: {
        status: true,
        state: true,
        customer: true,
        agent: true,
        reservation: {
          include: {
            agent: true,

            partner: true,
            customer: true,

            paymentMethod: true,
            reservationItems: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
                tax: {
                  select: {
                    value: true,
                  },
                },
              },
            },
          },
        },
        partner: true,
        orderItems: true,
        loyaltyPoints: true,
        paymentMethod: true,
      },
      skip: offset,
      take: limit,
    });

    const totalOrders = await prisma.order.count();

    return NextResponse.json(
      { message: "Orders retrieved", orders, totalOrders },
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

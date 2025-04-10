import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all reservations
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        customer: true,
        agent: true,
        partner: true,
        order: true,
        paymentMethod: true,
        reservationItems: true,
      },
    });

    return NextResponse.json(
      { message: "Reservations retrieved", reservations },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservations" },
      { status: 500 },
    );
  }
}

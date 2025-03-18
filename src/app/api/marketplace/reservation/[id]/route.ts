import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a reservation by ID
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
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
        agent: true,
        partner: true,
        order: true,
        paymentMethod: true,
        reservationItems: true,
        loyaltyPoints: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Reservation retrieved", reservation },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservation" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a reservation by ID
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

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "Reservation updated", reservation: updatedReservation },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a reservation by ID
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

    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json(
      { message: "Reservation deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 },
    );
  }
}

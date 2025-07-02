import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a reservation item by ID
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
    const reservationItem = await prisma.reservationItem.findUnique({
      where: { id },
      include: {
        reservation: true,
        product: true,
        partner: true,
      },
    });

    if (!reservationItem) {
      return NextResponse.json(
        { message: "Reservation item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Reservation item retrieved", reservationItem },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservation item:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservation item" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a reservation item by ID
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

    const updatedReservationItem = await prisma.reservationItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Reservation item updated",
        reservationItem: updatedReservationItem,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating reservation item:", error);
    return NextResponse.json(
      { error: "Failed to update reservation item" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a reservation item by ID
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

    await prisma.reservationItem.delete({ where: { id } });

    return NextResponse.json(
      { message: "Reservation item deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting reservation item:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation item" },
      { status: 500 },
    );
  }
}

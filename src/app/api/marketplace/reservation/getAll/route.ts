import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const id = url.searchParams.get("id");

    const skip = (page - 1) * limit;
    const take = limit;

    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const reservations = id
      ? await prisma.reservation.findMany({
          where: { id },
          include: {
            customer: true,
            agent: true,
            partner: true,
            order: true,
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
            loyaltyPoints: true,
          },
        })
      : await prisma.reservation.findMany({
          skip: skip,
          take: take,
          include: {
            customer: true,
            agent: true,
            partner: true,
            order: true,
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
            loyaltyPoints: true,
          },
        });

    const totalCount = id
      ? reservations.length
      : await prisma.reservation.count();

    return NextResponse.json(
      {
        message: "Reservations retrieved",
        reservations,
        totalReservations: totalCount,
      },
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

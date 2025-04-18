import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const searchTerm = url.searchParams.get("search");

    const skip = (page - 1) * limit;
    const take = limit;

    let reservations;
    if (searchTerm) {
      if (ObjectId.isValid(searchTerm)) {
        reservations = await prisma.reservation.findMany({
          where: { id: searchTerm },
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
      } else {
        reservations = await prisma.reservation.findMany({
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
      }
    } else {
      reservations = await prisma.reservation.findMany({
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
    }

    const totalCount = await prisma.reservation.count();
    const reservations = await prisma.reservation.findMany({
      include: {
        customers: true,
        agent: true,
        partner: true,
        order: true,
        paymentMethod: true,
        reservationItems: true,
      },
    });

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

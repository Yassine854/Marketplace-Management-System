import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all partners with their related data
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partners = await prisma.partner.findMany({
      include: {
        favoritePartners: true,
        orders: true,
        reservations: true,
        typePartner: true,
      },
    });

    if (partners.length === 0) {
      return NextResponse.json(
        { message: "No partners found", partners: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Partners retrieved successfully", partners },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve partners" },
      { status: 500 },
    );
  }
}

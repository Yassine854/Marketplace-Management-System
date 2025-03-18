import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all favorite partners with their related data
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const favoritePartners = await prisma.favoritePartner.findMany({
      include: {
        customer: true,
        product: true,
        partner: true,
      },
    });

    if (favoritePartners.length === 0) {
      return NextResponse.json(
        { message: "No favorite partners found", favoritePartners: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Favorite partners retrieved successfully", favoritePartners },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching favorite partners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite partners" },
      { status: 500 },
    );
  }
}

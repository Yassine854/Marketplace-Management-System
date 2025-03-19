import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const typePartners = await prisma.typePartner.findMany({
      include: {
        partners: true,
      },
    });

    return NextResponse.json(
      { message: "TypePartners retrieved successfully", typePartners },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePartners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePartners" },
      { status: 500 },
    );
  }
}

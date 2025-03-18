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

    const typePcbs = await prisma.typePcb.findMany();
    return NextResponse.json(
      { message: "TypePcbs retrieved successfully", typePcbs },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePcbs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePcbs" },
      { status: 500 },
    );
  }
}

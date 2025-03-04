import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handler pour une requête GET
export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.log.findMany();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des logs" },
      { status: 500 },
    );
  }
}

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

    const permissions = await prisma.permission.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (permissions.length === 0) {
      return NextResponse.json(
        { message: "No permissions found", permissions: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Permissions retrieved successfully", permissions },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve permissions" },
      { status: 500 },
    );
  }
}

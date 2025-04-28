import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    /*  const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }*/

    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (roles.length === 0) {
      return NextResponse.json(
        { message: "No roles found", roles: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Roles retrieved successfully", roles },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to retrieve roles" },
      { status: 500 },
    );
  }
}

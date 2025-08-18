import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { auth } from "@/services/auth";

export const DELETE = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { message: "username is required" },
        { status: 400 },
      );
    }

    const user = await prisma.getUser(username);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prismaClient.user.delete({ where: { id: user.id } });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
};

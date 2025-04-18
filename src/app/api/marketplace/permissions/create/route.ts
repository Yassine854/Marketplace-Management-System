import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { resource } = body;

    if (!resource) {
      return NextResponse.json(
        { error: "resource is required." },
        { status: 400 },
      );
    }

    const newPermission = await prisma.permission.create({
      data: { resource },
    });

    return NextResponse.json(
      { message: "Permission created successfully", permission: newPermission },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating permission:", error);
    return NextResponse.json(
      { error: "Failed to create permission" },
      { status: 500 },
    );
  }
}

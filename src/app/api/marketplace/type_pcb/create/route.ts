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
    const existingTypePcb = await prisma.typePcb.findUnique({
      where: { name: body.name },
    });
    if (existingTypePcb) {
      return NextResponse.json(
        { message: "TypePcb with this name already exists" },
        { status: 409 },
      );
    }

    const newTypePcb = await prisma.typePcb.create({
      data: { name: body.name },
    });
    return NextResponse.json(
      { message: "TypePcb created successfully", typePcb: newTypePcb },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to create TypePcb" },
      { status: 500 },
    );
  }
}

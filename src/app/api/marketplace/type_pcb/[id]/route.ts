import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const typePcb = await prisma.typePcb.findUnique({
      where: { id: params.id },
      include: {
        products: true,
      },
    });
    if (!typePcb) {
      return NextResponse.json(
        { message: "TypePcb not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "TypePcb retrieved successfully", typePcb },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePcb" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatedTypePcb = await prisma.typePcb.update({
      where: { id: params.id },
      data: { name: body.name },
    });
    return NextResponse.json(
      { message: "TypePcb updated successfully", typePcb: updatedTypePcb },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to update TypePcb" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.typePcb.delete({ where: { id: params.id } });
    return NextResponse.json(
      { message: "TypePcb deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to delete TypePcb" },
      { status: 500 },
    );
  }
}

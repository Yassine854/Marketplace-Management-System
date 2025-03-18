import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const typePartner = await prisma.typePartner.findUnique({ where: { id } });

    if (!typePartner) {
      return NextResponse.json(
        { message: "TypePartner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "TypePartner retrieved successfully", typePartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePartner" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedTypePartner = await prisma.typePartner.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "TypePartner updated successfully",
        typePartner: updatedTypePartner,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to update TypePartner" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await prisma.typePartner.delete({ where: { id } });

    return NextResponse.json(
      { message: "TypePartner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to delete TypePartner" },
      { status: 500 },
    );
  }
}

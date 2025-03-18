import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // For password hashing
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a partner by ID
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

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        favoritePartners: true,
        orders: true,
        reservations: true,
        loyaltyPoints: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Partner retrieved successfully", partner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve partner" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a partner's details
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

    // Hash new password if provided
    let updatedData = { ...body };
    if (body.password) {
      updatedData.password = await hash(body.password, 10);
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      { message: "Partner updated successfully", partner: updatedPartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a partner by ID
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

    await prisma.partner.delete({ where: { id } });

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 },
    );
  }
}

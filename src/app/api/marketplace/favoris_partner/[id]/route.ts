import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a favorite partner by ID
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

    const favoritePartner = await prisma.favoritePartner.findUnique({
      where: { id },
      include: {
        customer: true,
        partner: true,
      },
    });

    if (!favoritePartner) {
      return NextResponse.json(
        { message: "Favorite partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Favorite partner retrieved successfully", favoritePartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite partner" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a favorite partner's details
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

    const updatedFavoritePartner = await prisma.favoritePartner.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Favorite partner updated successfully",
        favoritePartner: updatedFavoritePartner,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to update favorite partner" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a favorite partner by ID
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

    await prisma.favoritePartner.delete({ where: { id } });

    return NextResponse.json(
      { message: "Favorite partner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting favorite partner:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite partner" },
      { status: 500 },
    );
  }
}

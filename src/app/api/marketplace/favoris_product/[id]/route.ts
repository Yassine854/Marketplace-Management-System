import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a favorite product by ID
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

    const favoriteProduct = await prisma.favoriteProduct.findUnique({
      where: { id },
      include: {
        customer: true,
        product: true,
      },
    });

    if (!favoriteProduct) {
      return NextResponse.json(
        { message: "Favorite product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Favorite product retrieved successfully", favoriteProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching favorite product:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite product" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a favorite product's details
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

    const updatedFavoriteProduct = await prisma.favoriteProduct.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Favorite product updated successfully",
        favoriteProduct: updatedFavoriteProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating favorite product:", error);
    return NextResponse.json(
      { error: "Failed to update favorite product" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a favorite product by ID
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

    await prisma.favoriteProduct.delete({ where: { id } });

    return NextResponse.json(
      { message: "Favorite product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting favorite product:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite product" },
      { status: 500 },
    );
  }
}

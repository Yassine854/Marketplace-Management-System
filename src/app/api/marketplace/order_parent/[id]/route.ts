import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single MainOrder by ID
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

    const mainOrder = await prisma.mainOrder.findUnique({
      where: { id },
      include: {
        orders: true, // Include related orders
      },
    });

    if (!mainOrder) {
      return NextResponse.json(
        { message: "MainOrder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "MainOrder retrieved successfully", mainOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching main order:", error);
    return NextResponse.json(
      { error: "Failed to retrieve main order" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update MainOrder details
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

    const updatedMainOrder = await prisma.mainOrder.update({
      where: { id },
      data: {},
    });

    return NextResponse.json(
      {
        message: "MainOrder updated successfully",
        mainOrder: updatedMainOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating main order:", error);
    return NextResponse.json(
      { error: "Failed to update main order" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a MainOrder by ID
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

    await prisma.mainOrder.delete({ where: { id } });

    return NextResponse.json(
      { message: "MainOrder deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting main order:", error);
    return NextResponse.json(
      { error: "Failed to delete main order" },
      { status: 500 },
    );
  }
}

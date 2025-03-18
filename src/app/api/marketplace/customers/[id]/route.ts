import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // Import bcryptjs for password hashing
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a customer by ID
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

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        favoriteProducts: true,
        favoritePartners: true,
        orders: true,
        reservations: true,
        notifications: true, // Include notifications if needed
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Customer retrieved successfully", customer },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a customer's details
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

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      { message: "Customer updated successfully", customer: updatedCustomer },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a customer by ID
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

    await prisma.customer.delete({ where: { id } });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}

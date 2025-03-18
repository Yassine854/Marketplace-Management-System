import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // Import bcryptjs for password hashing
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new customer
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the customer already exists by email or telephone
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: body.email }, { telephone: body.telephone }],
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: "Customer with this email or telephone already exists" },
        { status: 409 },
      );
    }

    // Hash the password before storing it
    const hashedPassword = await hash(body.password, 10);

    // Create the customer in the database
    const newCustomer = await prisma.customer.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword, // Store hashed password
        roleId: body.roleId,
        isActive: body.isActive ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully", customer: newCustomer },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}

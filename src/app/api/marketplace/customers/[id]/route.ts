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

    const { id } = params;
    const customers = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!customers) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Customer retrieved successfully", customers },
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

// 🟡 PATCH: Update agent details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await req.formData();

    const existingCustomer = await prisma.customers.findUnique({
      where: { id },
    });
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    const updateData: any = {};
    const fields = [
      "firstName",
      "lastName",
      "email",
      "telephone",
      "address",
      "governorate",
      "gender",
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== "") {
        updateData[field] = value;
      }
    }

    const isActive = formData.get("isActive");
    if (isActive !== null) {
      updateData.isActive = isActive === "true";
    }

    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await prisma.agent.findFirst({
        where: { email: updateData.email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
        );
      }
    }

    const updatedCustomer = await prisma.customers.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Agent updated successfully", agent: updatedCustomer },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating Customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer", details: error.message },
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

    const { id } = params;
    await prisma.customers.delete({ where: { id } });

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

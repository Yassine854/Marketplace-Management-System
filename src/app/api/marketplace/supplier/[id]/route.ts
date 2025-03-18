// app/api/manufacturers/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single manufacturer by ID
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

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id },
    });

    if (!manufacturer) {
      return NextResponse.json(
        { message: "Manufacturer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Manufacturer retrieved successfully", manufacturer },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve manufacturer" },
      { status: 500 },
    );
  }
}

// PATCH: Update a manufacturer's details
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

    const updatedManufacturer = await prisma.manufacturer.update({
      where: { id },
      data: {
        manufacturerId: body.manufacturerId,
        code: body.code,
        companyName: body.companyName,
        contactName: body.contactName,
        phoneNumber: body.phoneNumber,
        postalCode: body.postalCode,
        city: body.city,
        country: body.country,
        capital: body.capital,
        email: body.email,
        address: body.address,
      },
    });

    return NextResponse.json(
      {
        message: "Manufacturer updated successfully",
        manufacturer: updatedManufacturer,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to update manufacturer" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a manufacturer by ID
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

    await prisma.manufacturer.delete({ where: { id } });

    return NextResponse.json(
      { message: "Manufacturer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to delete manufacturer" },
      { status: 500 },
    );
  }
}

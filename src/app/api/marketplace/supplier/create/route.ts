// app/api/manufacturers/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new manufacturer
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Create the manufacturer in the database
    const newManufacturer = await prisma.manufacturer.create({
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
        message: "Manufacturer created successfully",
        manufacturer: newManufacturer,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to create manufacturer" },
      { status: 500 },
    );
  }
}

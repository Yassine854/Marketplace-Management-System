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
    const {
      manufacturerId,
      code,
      companyName,
      contactName,
      phoneNumber,
      postalCode,
      city,
      country,
      capital,
      email,
      address,
      categories, // Liste des IDs des catégories
    } = body;

    // Log the received data
    console.log("Received data:", {
      manufacturerId,
      code,
      companyName,
      contactName,
      phoneNumber,
      postalCode,
      city,
      country,
      capital,
      email,
      address,
      categories,
    });

    // Create the manufacturer in the database
    const newManufacturer = await prisma.manufacturer.create({
      data: {
        manufacturerId,
        code,
        companyName,
        contactName,
        phoneNumber,
        postalCode,
        city,
        country,
        capital,
        email,
        address,
        supplierCategories: {
          create: categories.map((categoryId: string) => ({
            categoryId,
          })),
        },
      },
      include: {
        supplierCategories: true, // Inclure les catégories associées dans la réponse
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

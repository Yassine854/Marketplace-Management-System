import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // For password hashing
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 POST: Create a new partner
export async function POST(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if the partner already exists by username or email
    const existingPartner = await prisma.partner.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { message: "Partner with this username or email already exists" },
        { status: 409 },
      );
    }

    // Hash the password before storing it
    const hashedPassword = await hash(body.password, 10);

    // Create the partner in the database
    const newPartner = await prisma.partner.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword, // Store hashed password
        roleId: body.roleId,
        isActive: body.isActive ?? true, // Default to true if not provided
        logo: body.logo,
        patent: body.patent,
        responsibleName: body.responsibleName,
        position: body.position,
        coverageArea: body.coverageArea,
        minimumAmount: body.minimumAmount,
        typePartnerId: body.typePartnerId,
      },
    });

    return NextResponse.json(
      { message: "Partner created successfully", partner: newPartner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 },
    );
  }
}

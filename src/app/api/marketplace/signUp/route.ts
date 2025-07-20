import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { encode } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get form data
    const formData = await req.formData();

    // Validate required fields (only the ones in the form)
    const requiredFields = [
      "username",
      "email",
      "telephone",
      "address",
      "password",
      "coverageArea",
      "minimumAmount",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData.get(field),
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Extract and convert values
    const minimumAmount = parseFloat(formData.get("minimumAmount") as string);
    if (isNaN(minimumAmount)) {
      return NextResponse.json(
        { error: "Invalid minimum amount" },
        { status: 400 },
      );
    }

    // Check for existing partner
    const existingPartner = await prisma.partner.findFirst({
      where: {
        OR: [
          { username: formData.get("username") as string },
          { email: formData.get("email") as string },
        ],
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(formData.get("password") as string, 10);

    // Find the KamiounPartnerMaster role
    const partnerRole = await prisma.role.findFirst({
      where: {
        name: "KamiounPartnerMaster",
      },
    });

    if (!partnerRole) {
      return NextResponse.json(
        { error: "Partner role not found" },
        { status: 500 },
      );
    }

    // Create partner with only the required fields
    const newPartner = await prisma.partner.create({
      data: {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        telephone: formData.get("telephone") as string,
        address: formData.get("address") as string,
        password: hashedPassword,
        coverageArea: formData.get("coverageArea") as string,
        minimumAmount,
        isActive: false,
        mRoleId: partnerRole.id,
      },
    });

    // Create session token for the new partner
    const sessionToken = await encode({
      token: {
        id: newPartner.id,
        username: newPartner.username,
        email: newPartner.email,
        userType: "partner",
        roleId: newPartner.mRoleId || "",
        mRoleId: newPartner.mRoleId || "",
        isActive: newPartner.isActive,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      },
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
      salt: "partner-signup", // Add this line
    });

    // Create response with session
    const response = NextResponse.json(
      {
        message: "Partner signed up successfully",
        partner: newPartner,
        sessionCreated: true,
      },
      { status: 201 },
    );

    // Set session cookie
    response.cookies.set("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Error signing up partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign up partner" },
      { status: 500 },
    );
  }
}

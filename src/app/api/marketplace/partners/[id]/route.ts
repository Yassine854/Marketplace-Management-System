import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // For password hashing
import { auth } from "../../../../../services/auth"; // Import authentication service
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
const prisma = new PrismaClient();

// 🟢 GET: Retrieve a partner by ID
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

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        favoritePartners: true,
        orders: true,
        reservations: true,
        typePartner: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Partner retrieved successfully", partner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve partner" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a partner's details
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

    // Get existing partner
    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Validate required fields
    const requiredFields = [
      "username",
      "firstName",
      "lastName",
      "email",
      "telephone",
      "address",
      "responsibleName",
      "position",
      "coverageArea",
      "minimumAmount",
      "typePartnerId",
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

    // Check for username/email conflicts
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;

    if (username !== existingPartner.username) {
      const existingUsername = await prisma.partner.findFirst({
        where: { username },
      });
      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
    }

    if (email !== existingPartner.email) {
      const existingEmail = await prisma.partner.findFirst({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
        );
      }
    }

    // Handle file updates
    let logoUrl = existingPartner.logo;
    let patentUrl = existingPartner.patent;

    // Process logo
    const removeLogo = formData.get("removeLogo") === "true";
    const newLogoFile = formData.get("logo") as File | null;

    if (removeLogo) {
      if (logoUrl) {
        const oldLogoPath = path.join(process.cwd(), "public", logoUrl);
        await unlink(oldLogoPath).catch(console.error);
        logoUrl = null;
      }
    }

    if (newLogoFile) {
      // Validate file type
      const validLogoTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validLogoTypes.includes(newLogoFile.type)) {
        return NextResponse.json(
          { error: "Invalid logo image format" },
          { status: 400 },
        );
      }

      // Delete old logo
      if (logoUrl) {
        const oldLogoPath = path.join(process.cwd(), "public", logoUrl);
        await unlink(oldLogoPath).catch(console.error);
      }

      // Upload new logo
      const buffer = Buffer.from(await newLogoFile.arrayBuffer());
      const fileName = `logo-${Date.now()}-${newLogoFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/partners/logos",
        fileName,
      );

      await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
      await writeFile(uploadPath, buffer);
      logoUrl = `/uploads/partners/logos/${fileName}`;
    }

    // Process patent
    const removePatent = formData.get("removePatent") === "true";
    const newPatentFile = formData.get("patent") as File | null;

    if (removePatent) {
      if (patentUrl) {
        const oldPatentPath = path.join(process.cwd(), "public", patentUrl);
        await unlink(oldPatentPath).catch(console.error);
        patentUrl = null;
      }
    }

    if (newPatentFile) {
      // Validate file type
      if (newPatentFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Invalid patent file format" },
          { status: 400 },
        );
      }

      // Delete old patent
      if (patentUrl) {
        const oldPatentPath = path.join(process.cwd(), "public", patentUrl);
        await unlink(oldPatentPath).catch(console.error);
      }

      // Upload new patent
      const buffer = Buffer.from(await newPatentFile.arrayBuffer());
      const fileName = `patent-${Date.now()}-${newPatentFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/partners/patents",
        fileName,
      );

      await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
      await writeFile(uploadPath, buffer);
      patentUrl = `/uploads/partners/patents/${fileName}`;
    }

    // Update partner data
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: {
        username,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email,
        telephone: formData.get("telephone") as string,
        address: formData.get("address") as string,
        responsibleName: formData.get("responsibleName") as string,
        position: formData.get("position") as string,
        coverageArea: formData.get("coverageArea") as string,
        minimumAmount: parseFloat(formData.get("minimumAmount") as string),
        typePartnerId: formData.get("typePartnerId") as string,
        isActive: formData.get("isActive") === "true",
        logo: logoUrl,
        patent: patentUrl,
      },
    });

    return NextResponse.json(
      { message: "Partner updated successfully", partner: updatedPartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a partner by ID
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

    await prisma.partner.delete({ where: { id } });

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 },
    );
  }
}

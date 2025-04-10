import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get form data first before any other processing
    const formData = await req.formData();

    // Then check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    const requiredFields = [
      "username",
      "email",
      "password",
      "roleId",
      "typePartnerId",
      "firstName",
      "lastName",
      "telephone",
      "address",
      "responsibleName",
      "position",
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

    // File handling
    const handleFileUpload = async (
      file: File | null,
      types: string[],
      folder: string,
    ) => {
      try {
        if (!file) return null;

        if (!types.includes(file.type)) {
          throw new Error(`Invalid file type for ${folder}`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${folder}-${Date.now()}-${file.name}`;
        const uploadPath = path.join(
          process.cwd(),
          "public/uploads/partners",
          folder,
          fileName,
        );

        await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
        await writeFile(uploadPath, buffer);
        return `/uploads/partners/${folder}/${fileName}`;
      } catch (error) {
        console.error(`File upload error (${folder}):`, error);
        throw new Error(`Failed to upload ${folder} file`);
      }
    };

    const [logoUrl, patentUrl] = await Promise.all([
      handleFileUpload(
        formData.get("logo") as File | null,
        ["image/jpeg", "image/png", "image/webp"],
        "logos",
      ),
      handleFileUpload(
        formData.get("patent") as File | null,
        ["application/pdf"],
        "patents",
      ),
    ]);

    // Hash password
    const hashedPassword = await hash(formData.get("password") as string, 10);

    // Create partner
    const newPartner = await prisma.partner.create({
      data: {
        username: formData.get("username") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        telephone: formData.get("telephone") as string,
        address: formData.get("address") as string,
        password: hashedPassword,
        roleId: formData.get("roleId") as string,
        responsibleName: formData.get("responsibleName") as string,
        position: formData.get("position") as string,
        coverageArea: formData.get("coverageArea") as string,
        minimumAmount,
        typePartnerId: formData.get("typePartnerId") as string,
        logo: logoUrl,
        patent: patentUrl,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Partner created successfully", partner: newPartner },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create partner" },
      { status: 500 },
    );
  }
}

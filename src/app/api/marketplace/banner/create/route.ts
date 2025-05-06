import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

// POST: Create a new banner
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Banner" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Banner" },
          { status: 403 },
        );
      }
    }

    const existingData = await prisma.banner.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Banner",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Banner",
          },
        });
      }
    }

    // Process form data instead of JSON
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    // Validate image type
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validImageTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 },
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public/uploads/banners");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    // Save the image file
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `banner-${Date.now()}-${imageFile.name.replace(
      /\s+/g,
      "-",
    )}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Create the URL for the image
    const imageUrl = `/uploads/banners/${fileName}`;

    // Create the banner in the database
    const newBanner = await prisma.banner.create({
      data: {
        url: imageUrl,
        altText: altText || null,
      },
    });

    return NextResponse.json(
      { message: "Banner created successfully", banner: newBanner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 },
    );
  }
}

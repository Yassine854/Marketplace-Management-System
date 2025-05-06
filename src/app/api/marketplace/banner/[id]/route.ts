import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import * as path from "path";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

// GET: Retrieve a banner by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Banner" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Banner" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Banner retrieved successfully", banner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve banner" },
      { status: 500 },
    );
  }
}

// PATCH: Update a banner by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Banner" && rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Banner" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    // Process form data instead of JSON
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;

    // Get the existing banner
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    // Prepare update data
    const updateData: { url?: string; altText?: string | null } = {};

    // Update altText if provided
    if (altText !== null) {
      updateData.altText = altText;
    }

    // Process new image if provided
    if (imageFile) {
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
      updateData.url = imageUrl;

      // Delete the old image file if it exists and is in our uploads directory
      if (existingBanner.url && existingBanner.url.startsWith("/uploads/")) {
        try {
          const oldFilePath = path.join(
            process.cwd(),
            "public",
            existingBanner.url,
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (error) {
          console.error("Error deleting old banner image:", error);
          // Continue with the update even if deleting the old file fails
        }
      }
    }

    // Update the banner
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Banner updated successfully", banner: updatedBanner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a banner by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Banner" && rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Banner" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    // Get the banner to delete
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    // Delete the image file if it exists and is in our uploads directory
    if (banner.url && banner.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", banner.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error("Error deleting banner image:", error);
        // Continue with the deletion even if deleting the file fails
      }
    }

    // Delete the banner from the database
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 },
    );
  }
}

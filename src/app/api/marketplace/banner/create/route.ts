import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { supabase } from "@/libs/supabase/supabaseClient";

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

    // Upload the image to Supabase storage
    const buffer = await imageFile.arrayBuffer();
    const fileName = `banner-${Date.now()}-${imageFile.name.replace(
      /\s+/g,
      "-",
    )}`;

    const { data, error } = await supabase.storage
      .from("marketplace")
      .upload(`banners/${fileName}`, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("marketplace")
      .getPublicUrl(`banners/${fileName}`);

    const imageUrl = publicUrl;

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

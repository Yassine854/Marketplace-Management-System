import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";
import { supabase } from "@/libs/supabase/supabaseClient";
const prisma = new PrismaClient();

// 🟢 GET: Retrieve a partner by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let user = session.user as {
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

      // const canRead = rolePermissions.some(
      //   (rp) =>
      //     rp.permission?.resource === "Partner" && rp.actions.includes("read"),
      // );

      // if (!canRead) {
      //   return NextResponse.json(
      //     { message: "Forbidden: missing 'read' permission for Partner" },
      //     { status: 403 },
      //   );
      // }
    }

    const { id } = params;

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        favoritePartners: true,
        typePartner: true,
        role: true,
        skuPartners: true,
        OrderItem: true,
        settings: true,
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

    let user = session.user as {
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

      // Permission checks commented out
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

    // Remove validation for required fields - we'll use existing values if not provided

    // Prepare update data with existing values as defaults
    const updateData: any = {
      username:
        (formData.get("username") as string) || existingPartner.username,
      firstName:
        (formData.get("firstName") as string) || existingPartner.firstName,
      lastName:
        (formData.get("lastName") as string) || existingPartner.lastName,
      email: (formData.get("email") as string) || existingPartner.email,
      telephone:
        (formData.get("telephone") as string) || existingPartner.telephone,
      address: (formData.get("address") as string) || existingPartner.address,
      responsibleName:
        (formData.get("responsibleName") as string) ||
        existingPartner.responsibleName,
      position:
        (formData.get("position") as string) || existingPartner.position,
      coverageArea:
        (formData.get("coverageArea") as string) ||
        existingPartner.coverageArea,
      typePartnerId:
        (formData.get("typePartnerId") as string) ||
        existingPartner.typePartnerId,
      mRoleId: (formData.get("mRoleId") as string) || existingPartner.mRoleId,
    };

    // Handle minimumAmount separately since it's a number
    const minimumAmountStr = formData.get("minimumAmount") as string;
    updateData.minimumAmount = minimumAmountStr
      ? parseFloat(minimumAmountStr)
      : existingPartner.minimumAmount;

    // Handle isActive separately since it's a boolean
    const isActiveStr = formData.get("isActive") as string;
    if (isActiveStr !== null) {
      updateData.isActive = isActiveStr === "true";
    } else {
      updateData.isActive = existingPartner.isActive;
    }

    // Handle password update separately to hash it
    const password = formData.get("password") as string;
    if (password) {
      const hashedPassword = await hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Check username uniqueness only if it's being changed
    if (updateData.username !== existingPartner.username) {
      const existingUsername = await prisma.partner.findFirst({
        where: { username: updateData.username },
      });
      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
    }

    // Check email uniqueness only if it's being changed
    if (updateData.email !== existingPartner.email) {
      const existingEmail = await prisma.partner.findFirst({
        where: { email: updateData.email },
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
        const oldLogoPath = logoUrl.split("/").slice(-2).join("/");
        await supabase.storage
          .from("marketplace")
          .remove([oldLogoPath])
          .catch((error) => console.error("Error deleting old logo:", error));
        logoUrl = null;
      }
    }

    if (newLogoFile) {
      const validLogoTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validLogoTypes.includes(newLogoFile.type)) {
        return NextResponse.json(
          { error: "Invalid logo image format" },
          { status: 400 },
        );
      }

      // Delete old logo from Supabase if exists
      if (logoUrl) {
        const oldLogoPath = logoUrl.split("/").slice(-2).join("/");
        await supabase.storage
          .from("marketplace")
          .remove([oldLogoPath])
          .catch((error) => console.error("Error deleting old logo:", error));
      }

      // Upload new logo to Supabase
      const buffer = await newLogoFile.arrayBuffer();
      const fileName = `logo-${Date.now()}-${newLogoFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      const { data, error } = await supabase.storage
        .from("marketplace")
        .upload(`partners/logos/${fileName}`, buffer, {
          contentType: newLogoFile.type,
        });

      if (error) {
        console.error("Error uploading logo:", error);
        return NextResponse.json(
          { error: "Failed to upload logo" },
          { status: 500 },
        );
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("marketplace")
        .getPublicUrl(`partners/logos/${fileName}`);

      logoUrl = publicUrl;
    }

    // Process patent
    const removePatent = formData.get("removePatent") === "true";
    const newPatentFile = formData.get("patent") as File | null;

    if (removePatent) {
      if (patentUrl) {
        const oldPatentPath = patentUrl.split("/").slice(-2).join("/");
        await supabase.storage
          .from("marketplace")
          .remove([oldPatentPath])
          .catch((error) => console.error("Error deleting old patent:", error));
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

      // Delete old patent from Supabase if exists
      if (patentUrl) {
        const oldPatentPath = patentUrl.split("/").slice(-2).join("/");
        await supabase.storage
          .from("marketplace")
          .remove([oldPatentPath])
          .catch((error) => console.error("Error deleting old patent:", error));
      }

      // Upload new patent to Supabase
      const buffer = await newPatentFile.arrayBuffer();
      const fileName = `patent-${Date.now()}-${newPatentFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      const { data, error } = await supabase.storage
        .from("marketplace")
        .upload(`partners/patents/${fileName}`, buffer, {
          contentType: newPatentFile.type,
        });

      if (error) {
        console.error("Error uploading patent:", error);
        return NextResponse.json(
          { error: "Failed to upload patent" },
          { status: 500 },
        );
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("marketplace")
        .getPublicUrl(`partners/patents/${fileName}`);

      patentUrl = publicUrl;
    }

    // Add file URLs to update data
    updateData.logo = logoUrl;
    updateData.patent = patentUrl;

    // Update partner data
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: updateData,
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
    //Session Authorization
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    //Permission Check
    let user = session.user as {
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
          rp.permission?.resource === "Partner" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Partner" },
          { status: 403 },
        );
      }
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

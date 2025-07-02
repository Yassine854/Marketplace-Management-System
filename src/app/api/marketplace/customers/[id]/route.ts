import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Customer" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const customers = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!customers) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Customer retrieved successfully", customers },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer" },
      { status: 500 },
    );
  }
}

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
          rp.permission?.resource === "Customer" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const formData = await req.formData();

    // Validate required fields if present in update
    const requiredFields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "businessType", label: "Business Type" },
      { key: "activity1", label: "Primary Activity" },
    ];
    const missingFields = requiredFields.filter(({ key }) => {
      if (formData.has(key)) {
        const value = formData.get(key);
        return !value || (typeof value === "string" && value.trim() === "");
      }
      return false;
    });
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required field(s): ${missingFields
            .map((f) => f.label)
            .join(", ")}`,
        },
        { status: 400 },
      );
    }

    const existingCustomer = await prisma.customers.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    // Handle file uploads
    const cinPhotoFile = formData.get("cinPhoto");
    const patentPhotoFile = formData.get("patentPhoto");

    let cinPhotoUrl = null;
    let patentPhotoUrl = null;

    // Helper function to handle file uploads
    const handleFileUpload = async (file: any, prefix: string) => {
      if (!file || typeof file === "string") return null;

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type");
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${prefix}-${Date.now()}-${file.name}`;
      const filepath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "customers",
        filename,
      );

      // Ensure directory exists
      await fs.promises.mkdir(path.dirname(filepath), { recursive: true });

      await writeFile(filepath, buffer);
      return `/uploads/customers/${filename}`;
    };

    try {
      if (cinPhotoFile) {
        cinPhotoUrl = await handleFileUpload(cinPhotoFile, "cin");
      }

      if (patentPhotoFile) {
        patentPhotoUrl = await handleFileUpload(patentPhotoFile, "patent");
      }
    } catch (fileError) {
      return NextResponse.json(
        { error: "Invalid file upload" },
        { status: 400 },
      );
    }

    const updateData: any = {
      firstName: (formData.get("firstName") as string) || undefined,
      lastName: (formData.get("lastName") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      telephone: (formData.get("telephone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      governorate: (formData.get("governorate") as string) || undefined,

      socialName: (formData.get("socialName") as string) || undefined,
      fiscalId: (formData.get("fiscalId") as string) || undefined,
      businessType: (formData.get("businessType") as string) || undefined,
      activity1: (formData.get("activity1") as string) || undefined,
      activity2: (formData.get("activity2") as string) || undefined,
      mRoleId: (formData.get("mRoleId") as string) || undefined,
    };

    // Only add password if it's provided
    const password = formData.get("password") as string;
    if (password) {
      updateData.password = await hash(password, 10);
    }

    // Only add photo URLs if new files were uploaded
    if (cinPhotoUrl) {
      updateData.cinPhoto = cinPhotoUrl;

      // Delete old cinPhoto if exists
      if (existingCustomer.cinPhoto) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingCustomer.cinPhoto,
        );
        await fs.promises.unlink(oldPath).catch(() => {});
      }
    }

    if (patentPhotoUrl) {
      updateData.patentPhoto = patentPhotoUrl;

      // Delete old patentPhoto if exists
      if (existingCustomer.patentPhoto) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingCustomer.patentPhoto,
        );
        await fs.promises.unlink(oldPath).catch(() => {});
      }
    }

    // Handle isActive
    const isActive = formData.get("isActive");
    if (isActive !== null) {
      updateData.isActive = isActive === "true";
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    // Check if email is being changed and if it already exists
    // if (updateData.email && updateData.email !== existingCustomer.email) {
    //   const emailExists = await prisma.customers.findFirst({
    //     where: {
    //       email: updateData.email,
    //       NOT: { id: existingCustomer.id },
    //     },
    //   });
    //   if (emailExists) {
    //     return NextResponse.json(
    //       { error: "Email already exists" },
    //       { status: 409 },
    //     );
    //   }
    // }

    const updatedCustomer = await prisma.customers.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Customer updated successfully", customer: updatedCustomer },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Customer" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.customers.delete({ where: { id } });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}

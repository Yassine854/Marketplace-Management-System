import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Customer" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const formData = await req.formData();

    // Validate required fields
    const requiredFields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "businessType", label: "Business Type" },
      { key: "activity1", label: "Primary Activity" },
    ];
    const missingFields = requiredFields.filter(({ key }) => {
      const value = formData.get(key);
      return !value || (typeof value === "string" && value.trim() === "");
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

    const existingData = await prisma.customers.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Customer",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Customer",
          },
        });
      }
    }

    // Handle file uploads
    const cinPhotoFile = formData.get("cinPhoto") as File | null;
    const patentPhotoFile = formData.get("patentPhoto") as File | null;

    let cinPhotoUrl = null;
    let patentPhotoUrl = null;

    if (cinPhotoFile) {
      const bytes = await cinPhotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${Date.now()}-${cinPhotoFile.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);

      await writeFile(filepath, buffer);
      cinPhotoUrl = `/uploads/${filename}`;
    }

    if (patentPhotoFile) {
      const bytes = await patentPhotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${patentPhotoFile.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);

      await writeFile(filepath, buffer);
      patentPhotoUrl = `/uploads/${filename}`;
    }

    const customerData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      telephone: formData.get("telephone") as string,
      address: formData.get("address") as string,
      governorate: formData.get("governorate") as string,
      password: await hash(formData.get("password") as string, 10),
      socialName: (formData.get("socialName") as string) || null,
      fiscalId: formData.get("fiscalId") as string,
      businessType: formData.get("businessType") as string,
      activity1: formData.get("activity1") as string,
      activity2: (formData.get("activity2") as string) || null,
      cinPhoto: cinPhotoUrl,
      patentPhoto: patentPhotoUrl,
      isActive: true,
      mRoleId: (formData.get("mRoleId") as string) || null,
    };

    // const existingCustomer = await prisma.customers.findFirst({
    //   where: { email: customerData.email },
    // });

    // if (existingCustomer) {
    //   return NextResponse.json(
    //     { error: "Email already exists" },
    //     { status: 409 },
    //   );
    // }

    const newCustomer = await prisma.customers.create({
      data: customerData,
    });

    return NextResponse.json({ customer: newCustomer }, { status: 201 });
  } catch (error) {
    console.error("Creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

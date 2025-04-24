// app/api/taxes/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new tax
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

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Check if user is KamiounAdminMaster or has required permission
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Tax" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Tax" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.tax.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Tax",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Tax",
          },
        });
      }
    }

    const newTax = await prisma.tax.create({
      data: {
        value: body.value,
      },
    });

    return NextResponse.json(
      { message: "Tax created successfully", tax: newTax },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating tax:", error);
    return NextResponse.json(
      { error: "Failed to create tax" },
      { status: 500 },
    );
  }
}

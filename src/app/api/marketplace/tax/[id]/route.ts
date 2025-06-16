// app/api/taxes/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single tax by ID
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Tax" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Tax" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    const tax = await prisma.tax.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!tax) {
      return NextResponse.json({ message: "Tax not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Tax retrieved successfully", tax },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching tax:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tax" },
      { status: 500 },
    );
  }
}

// PATCH: Update a tax's details
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

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Tax" && rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Tax" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    const updatedTax = await prisma.tax.update({
      where: { id },
      data: {
        value: body.value,
      },
    });

    return NextResponse.json(
      { message: "Tax updated successfully", tax: updatedTax },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating tax:", error);
    return NextResponse.json(
      { error: "Failed to update tax" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a tax by ID
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

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Tax" && rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Tax" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    await prisma.tax.delete({ where: { id } });

    return NextResponse.json(
      { message: "Tax deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting tax:", error);
    return NextResponse.json(
      { error: "Failed to delete tax" },
      { status: 500 },
    );
  }
}

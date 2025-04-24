// app/api/statuses/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new status
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
    const userRole = await prisma.role.findFirst({
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
          rp.permission?.resource === "Status" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Status" },
          { status: 403 },
        );
      }
    }
    const body = await req.json();

    const existingData = await prisma.status.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Status",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Status",
          },
        });
      }
    }

    // Create the status in the database
    const newStatus = await prisma.status.create({
      data: {
        name: body.name,
        stateId: body.stateId,
      },
    });

    return NextResponse.json(
      { message: "Status created successfully", status: newStatus },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating status:", error);
    return NextResponse.json(
      { error: "Failed to create status" },
      { status: 500 },
    );
  }
}

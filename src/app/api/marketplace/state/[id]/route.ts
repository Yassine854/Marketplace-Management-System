// app/api/states/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a single state by ID
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

      const canAccess = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "State" && rp.actions.includes("read"),
      );

      if (!canAccess) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for State" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    const state = await prisma.state.findUnique({
      where: { id },
      include: {
        statuses: true,
      },
    });

    if (!state) {
      return NextResponse.json({ message: "State not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "State retrieved successfully", state },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching state:", error);
    return NextResponse.json(
      { error: "Failed to retrieve state" },
      { status: 500 },
    );
  }
}

// PATCH: Update a state's details
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

      const canAccess = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "State" && rp.actions.includes("update"),
      );

      if (!canAccess) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for State" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    const updatedState = await prisma.state.update({
      where: { id },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { message: "State updated successfully", state: updatedState },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating state:", error);
    return NextResponse.json(
      { error: "Failed to update state" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a state by ID
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

      const canAccess = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "State" && rp.actions.includes("delete"),
      );

      if (!canAccess) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for State" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    await prisma.state.delete({ where: { id } });

    return NextResponse.json(
      { message: "State deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting state:", error);
    return NextResponse.json(
      { error: "Failed to delete state" },
      { status: 500 },
    );
  }
}

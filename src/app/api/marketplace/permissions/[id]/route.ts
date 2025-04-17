import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET a specific permission (including roles)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Permission retrieved successfully", permission },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching permission:", error);
    return NextResponse.json(
      { error: "Failed to retrieve permission" },
      { status: 500 },
    );
  }
}

// PATCH - update permission resource and action
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { resource, action } = body;

    if (
      !resource ||
      typeof resource !== "string" ||
      !action ||
      typeof action !== "string"
    ) {
      return NextResponse.json(
        { error: "Both 'resource' and 'action' must be valid strings." },
        { status: 400 },
      );
    }

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: { resource, action },
    });

    return NextResponse.json(
      {
        message: "Permission updated successfully",
        permission: updatedPermission,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { error: "Failed to update permission" },
      { status: 500 },
    );
  }
}

// DELETE - delete permission (roles cascade via RolePermission)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.permission.delete({ where: { id } });

    return NextResponse.json(
      { message: "Permission deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { error: "Failed to delete permission" },
      { status: 500 },
    );
  }
}

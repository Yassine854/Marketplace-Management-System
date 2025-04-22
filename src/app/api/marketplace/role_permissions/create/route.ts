import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { roleId, permissionId, actions } = await req.json();

    if (!roleId || !permissionId) {
      return NextResponse.json(
        { error: "roleId and permissionId are required." },
        { status: 400 },
      );
    }

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json(
        { error: "actions must be a non-empty array of strings." },
        { status: 400 },
      );
    }

    const rolePermission = await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
        actions,
      },
    });

    return NextResponse.json(
      { message: "RolePermission created successfully", rolePermission },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating RolePermission:", error);
    return NextResponse.json(
      { error: "Failed to create RolePermission" },
      { status: 500 },
    );
  }
}

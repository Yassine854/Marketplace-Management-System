import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET a specific role
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

    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Role retrieved successfully", role },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Failed to retrieve role" },
      { status: 500 },
    );
  }
}

// PATCH - update role name only
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
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Role name is required and must be a string." },
        { status: 400 },
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(
      { message: "Role updated successfully", role: updatedRole },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 },
    );
  }
}

// DELETE - delete role (permissions cascade)
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

    await prisma.role.delete({ where: { id } });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 },
    );
  }
}

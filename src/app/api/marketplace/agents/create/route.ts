import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new agent
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
      userType?: string;
    };

    // Validate partnerId (required field)
    const partnerId = user.id;
    if (!partnerId) {
      return NextResponse.json(
        { message: "Partner ID is required" },
        { status: 400 },
      );
    }

    // Check permissions (KamiounAdminMaster or has 'create' permission)
    const userRole = await prisma.role.findFirst({
      where: { id: user.mRoleId },
    });

    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: user.mRoleId },
        include: { permission: true },
      });

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Delivery Agent" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'create' permission for Delivery Agent",
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    // Check for existing agent (with partnerId included)
    const existingAgent = await prisma.agent.findFirst({
      where: {
        partnerId,
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { message: "Agent with this username or email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(body.password, 10);

    // Create the agent (with required partnerId)
    const newAgent = await prisma.agent.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword,
        mRoleId: body.mRoleId,
        isActive: body.isActive ?? true,
        partnerId: partnerId, // Required field
      },
    });

    return NextResponse.json(
      { message: "Agent created successfully", agent: newAgent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 },
    );
  }
}

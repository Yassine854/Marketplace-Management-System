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

    let partnerId;
    if (user.userType === "partner") {
      partnerId = user.id;
    } else {
      // For admin users, get the partnerId from the request body
      partnerId = body.partnerId;

      if (!partnerId) {
        return NextResponse.json(
          {
            message:
              "Invalid request: 'partnerId' is required for admin users.",
          },
          { status: 400 },
        );
      }
    }

    // Check if the agent already exists by username or email
    const existingAgent = await prisma.agent.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { message: "Agent with this username or email already exists" },
        { status: 409 },
      );
    }

    // Check if any data exist
    const existingData = await prisma.agent.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Delivery Agent",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Delivery Agent",
          },
        });
      }
    }

    // Hash the password before storing it
    const hashedPassword = await hash(body.password, 10);

    // Create the agent in the database
    const newAgent = await prisma.agent.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword, // Store hashed password
        mRoleId: body.mRoleId,
        isActive: body.isActive ?? true,
        partnerId: partnerId,
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

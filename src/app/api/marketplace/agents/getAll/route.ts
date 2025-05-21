import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all agents with session authentication
export async function GET() {
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

    // Check permissions for non-admin users
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Delivery Agent" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'read' permission for Delivery Agent",
          },
          { status: 403 },
        );
      }
    }

    // Filter agents by partnerId if user is a partner, otherwise get all agents
    let agents;
    if (user.userType === "partner") {
      // For partners, only return agents associated with their ID
      agents = await prisma.agent.findMany({
        where: {
          partnerId: user.id,
        },
      });
    } else {
      // For admins and other authorized users, return all agents
      agents = await prisma.agent.findMany();
    }

    if (agents.length === 0) {
      return NextResponse.json(
        { message: "No agents found", agents: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Agents retrieved successfully", agents },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to retrieve agents" },
      { status: 500 },
    );
  }
}

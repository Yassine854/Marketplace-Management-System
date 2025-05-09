import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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
      userType?: string;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: {
        id: user.mRoleId,
      },
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Source" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Source" },
          { status: 403 },
        );
      }
    }

    // Filter sources by partnerId if user is a partner
    let whereClause = {};
    if (user.userType === "partner") {
      whereClause = { partnerId: user.id };
    }

    const sources = await prisma.source.findMany({
      where: whereClause,
      include: {
        partner: true,
        stock: true,
      },
    });

    if (sources.length === 0) {
      return NextResponse.json(
        { message: "No sources found", sources: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Sources retrieved successfully", sources },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sources" },
      { status: 500 },
    );
  }
}

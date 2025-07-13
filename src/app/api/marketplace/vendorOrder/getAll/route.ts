// app/api/states/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all states
export async function GET(req: Request) {
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

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "VendorOrder" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for VendorOrder" },
          { status: 403 },
        );
      }
    }

    // Fetch all VendorOrders where partnerId is the logged-in user's id
    const vendorOrders = await prisma.vendorOrder.findMany({
      where: { partnerId: user.id },
      include: {
        status: true,
        state: true,
        partner: true,
        order: {
          include: {
            customer: true,
          },
        },
        orderAgent: true,
      },
    });

    return NextResponse.json(
      { message: "VendorOrders retrieved successfully", vendorOrders },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { error: "Failed to retrieve states" },
      { status: 500 },
    );
  }
}

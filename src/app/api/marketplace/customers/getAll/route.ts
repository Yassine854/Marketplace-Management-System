import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import {
  isKamiounAdminMaster,
  getRoleIdForPermissions,
  UserSession,
} from "../../../../../utils/auth/getUserRole";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let user = session.user as UserSession;

    // Check if user is KamiounAdminMaster
    const isAdmin = await isKamiounAdminMaster(user);

    if (!isAdmin) {
      // For non-admin users, check role permissions
      const roleIdToCheck = getRoleIdForPermissions(user);

      if (!roleIdToCheck) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: roleIdToCheck,
        },
        include: {
          permission: true,
        },
      });

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Customer" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Customer" },
          { status: 403 },
        );
      }
    }

    const customers = await prisma.customers.findMany({
      include: {
        favoriteProducts: true,
        favoritePartners: true,
        orders: true,
        reservations: true,
        notifications: true,
      },
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { message: "No customers found", customers: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Customers retrieved successfully", customers },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customers" },
      { status: 500 },
    );
  }
}

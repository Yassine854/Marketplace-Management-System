import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve notifications for the current user
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
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Check if user is an admin
    const isAdmin =
      userRole?.name === "KamiounAdminMaster" ||
      (userRole?.name && userRole.name.includes("Admin"));

    let notifications = [];

    if (isAdmin) {
      // If user is admin, get all notifications where recipientType is "admin" and adminId is user.id
      notifications = await prisma.notification.findMany({
        where: {
          recipientType: "admin",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // If user is partner, get all notifications where recipientType is "partner" and partnerId is user.id
      notifications = await prisma.notification.findMany({
        where: {
          recipientType: "partner",
          partnerId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(
      { message: "Notifications retrieved successfully", notifications },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notifications" },
      { status: 500 },
    );
  }
}

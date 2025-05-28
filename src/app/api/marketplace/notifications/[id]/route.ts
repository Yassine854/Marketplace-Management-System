import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a notification by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    // Get the notification
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    // Verify the user has permission to view this notification
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    const isAdmin =
      userRole?.name === "KamiounAdminMaster" ||
      (userRole?.name && userRole.name.includes("Admin"));

    if (
      (notification.recipientType === "admin" && !isAdmin) ||
      (notification.recipientType === "partner" &&
        notification.partnerId !== user.id)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to view this notification" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { message: "Notification retrieved successfully", notification },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notification" },
      { status: 500 },
    );
  }
}

// PATCH: Update a notification by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;
    const body = await req.json();

    // Get the notification to update
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    // Verify the user has permission to update this notification
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    const isAdmin =
      userRole?.name === "KamiounAdminMaster" ||
      (userRole?.name && userRole.name.includes("Admin"));

    if (
      (notification.recipientType === "admin" && !isAdmin) ||
      (notification.recipientType === "partner" &&
        notification.partnerId !== user.id)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to update this notification" },
        { status: 403 },
      );
    }

    // Update the notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: body,
    });

    // Emit socket event for real-time notification update
    const io = require("socket.io-client");
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    socket.emit("notification_updated", updatedNotification);

    return NextResponse.json(
      {
        message: "Notification updated successfully",
        notification: updatedNotification,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a notification by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    // Get the notification to delete
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    // Verify the user has permission to delete this notification
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    const isAdmin =
      userRole?.name === "KamiounAdminMaster" ||
      (userRole?.name && userRole.name.includes("Admin"));

    if (
      (notification.recipientType === "admin" && !isAdmin) ||
      (notification.recipientType === "partner" &&
        notification.partnerId !== user.id)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to delete this notification" },
        { status: 403 },
      );
    }

    // Delete the notification from the database
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

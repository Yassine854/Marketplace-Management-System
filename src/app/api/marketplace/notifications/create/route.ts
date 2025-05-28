import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new notification
export async function POST(req: Request) {
  try {
    const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // Process JSON data
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.message || !body.recipientType || !body.link) {
      return NextResponse.json(
        { error: "Title, message, recipientType, and link are required" },
        { status: 400 },
      );
    }

    // Validate recipient type
    if (body.recipientType !== "admin" && body.recipientType !== "partner") {
      return NextResponse.json(
        { error: "RecipientType must be either 'admin' or 'partner'" },
        { status: 400 },
      );
    }

    // Validate recipient ID based on type
    if (body.recipientType === "admin" && !body.adminId) {
      return NextResponse.json(
        { error: "adminId is required when recipientType is 'admin'" },
        { status: 400 },
      );
    }

    if (body.recipientType === "partner" && !body.partnerId) {
      return NextResponse.json(
        { error: "partnerId is required when recipientType is 'partner'" },
        { status: 400 },
      );
    }

    // Prepare notification data
    const notificationData = {
      title: body.title,
      message: body.message,
      link: body.link,
      recipientType: body.recipientType,
      isRead: false,
      adminId: body.recipientType === "admin" ? body.adminId : null,
      partnerId: body.recipientType === "partner" ? body.partnerId : null,
    };

    // Create the notification in the database
    const newNotification = await prisma.notification.create({
      data: notificationData,
    });

    // Emit socket event for real-time notification
    const io = require("socket.io-client");
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    socket.emit("notification_created", newNotification);

    return NextResponse.json(
      {
        message: "Notification created successfully",
        notification: newNotification,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}

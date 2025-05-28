import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupWebSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  // Set up notification polling
  const pollNotifications = async () => {
    try {
      // Get all notifications
      const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
      });

      // Emit to all connected clients
      io.emit("notifications_updated", notifications);
    } catch (error) {
      console.error("Error polling notifications:", error);
    }
  };

  // Poll every 5 seconds for changes
  const pollingInterval = setInterval(pollNotifications, 5000);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send initial notifications on connection
    pollNotifications();

    // Listen for new notification creation
    socket.on("notification_created", (notification) => {
      io.emit("new_notification", notification);
    });

    // Listen for notification updates
    socket.on("notification_updated", (notification) => {
      io.emit("notification_changed", notification);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Clean up on server shutdown
  return () => {
    clearInterval(pollingInterval);
    io.close();
  };
}

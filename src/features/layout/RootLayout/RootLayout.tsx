import { Toaster } from "react-hot-toast";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";
import { useEffect } from "react";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { io } from "socket.io-client";

//@ts-ignore
const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { setNotifications, addNotification, updateNotification } =
    useGlobalStore();

  useEffect(() => {
    socket.on("connect", () => {
      console.info("connected to socket");
    });

    // Listen for all notifications update (polling)
    socket.on("notifications_updated", (notifications: any[]) => {
      setNotifications(notifications);
    });

    // Listen for new notification
    socket.on("new_notification", (notification: any) => {
      console.log("New notification received:", notification);
      addNotification(notification);
    });

    // Listen for notification updates
    socket.on("notification_changed", (notification: any) => {
      console.log("Notification updated:", notification);
      updateNotification(notification);
    });

    return () => {
      socket.off("notifications_updated");
      socket.off("new_notification");
      socket.off("notification_changed");
      socket.off("connect");
    };
  }, [setNotifications, addNotification, updateNotification]);

  return (
    <AuthWrapper>
      <TanstackQueryProvider>
        <Toaster />
        {children}
      </TanstackQueryProvider>
    </AuthWrapper>
  );
};

export default RootLayout;

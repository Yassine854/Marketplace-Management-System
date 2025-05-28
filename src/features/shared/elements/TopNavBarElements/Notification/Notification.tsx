import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";

interface NotificationType {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  recipientType: string;
  adminId?: string;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
}

const Notification = ({
  isWhite,
  setNewNotification,
}: {
  isWhite?: boolean;
  setNewNotification: any;
}) => {
  const { open, ref, toggleOpen } = useDropdown();
  const { setNotifications, markNotificationAsRead } = useGlobalStore();
  const [notifications, setLocalNotifications] = useState<NotificationType[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { push } = useRouter();
  const { setOrderOnReviewId } = useOrderDetailsStore();

  // Fetch notifications when component mounts or when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/marketplace/notifications/getAll");
      if (response.data.notifications) {
        setLocalNotifications(response.data.notifications);
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read when dropdown closes
  useEffect(() => {
    if (!open && notifications.some((notification) => !notification.isRead)) {
      markAllAsRead();
    }
  }, [open]);

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead,
    );

    if (unreadNotifications.length > 0) {
      try {
        // Update each unread notification
        await Promise.all(
          unreadNotifications.map((notification) =>
            axios.patch(`/api/marketplace/notifications/${notification.id}`, {
              isRead: true,
            }),
          ),
        );

        // Update local state
        setLocalNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );

        // Update global store
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );

        setNewNotification(false);
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationType) => {
    try {
      // Mark notification as read first
      if (!notification.isRead) {
        const response = await axios.patch(
          `/api/marketplace/notifications/${notification.id}`,
          {
            isRead: true,
          },
        );

        if (response.status === 200) {
          // Update local state
          setLocalNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n,
            ),
          );

          // Update global store
          markNotificationAsRead(notification.id);
        }
      }

      // Close the dropdown
      toggleOpen();

      // Extract order ID from link if it's an order notification
      if (notification.link.includes("orderDetails")) {
        const orderId = notification.link.split("/").pop();
        if (orderId) {
          setOrderOnReviewId(orderId);
        }
      }

      // Navigate to the notification link directly
      push(notification.link);
    } catch (error) {
      console.error("Failed to process notification click:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
  };

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead,
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className={`relative rounded-full p-2 sm:p-3 ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconBell />
        {hasUnreadNotifications && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>
      <div
        className={`absolute top-full z-50 h-80 w-[310px] overflow-auto rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 max-sm:origin-top ltr:max-sm:-right-[142px] ltr:sm:right-0 ltr:sm:origin-top-right rtl:max-sm:-left-[142px] rtl:sm:left-0 rtl:sm:origin-top-left ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b p-3 dark:border-n500 lg:px-4">
          <h5 className="h5">Notifications</h5>
          <Link
            href="/notifications"
            onClick={toggleOpen}
            className="text-sm text-primary"
          >
            View All
          </Link>
        </div>
        <ul className="flex flex-col p-4">
          {loading ? (
            <div className="flex justify-center p-4">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="flex justify-center p-4">No notifications</div>
          ) : (
            notifications.map((notification: NotificationType) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`mb-2 flex cursor-pointer gap-2 rounded-md p-2 duration-300 ${
                  !notification.isRead
                    ? "bg-primary/10 hover:bg-primary/20"
                    : "hover:bg-primary/10"
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconBell size={20} />
                </div>
                <div className="text-sm">
                  <div className="gap-1">
                    <div className="font-medium">{notification.title}</div>
                    <div>{notification.message}</div>
                  </div>
                  <span className="text-xs text-n100 dark:text-n50">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

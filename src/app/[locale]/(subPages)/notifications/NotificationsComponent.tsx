import Box from "@/features/layout/Box/Box";
import NotificationComponent from "./NotificationComponent";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useRouter } from "next/navigation";
import axios from "axios";

const Notifications = () => {
  const { notifications, markNotificationAsRead } = useGlobalStore();
  const { setOrderOnReviewId } = useOrderDetailsStore();
  const { push } = useRouter();

  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark notification as read if it's not already
      if (!notification.isRead) {
        const response = await axios.patch(
          `/api/marketplace/notifications/${notification.id}`,
          {
            isRead: true,
          },
        );

        if (response.status === 200) {
          // Update global store
          markNotificationAsRead(notification.id);
        }
      }

      // Extract order ID from link if it's an order notification
      if (notification.link && notification.link.includes("orderDetails")) {
        const orderId = notification.link.split("/").pop();
        if (orderId) {
          setOrderOnReviewId(orderId);
        }
      }

      // Navigate to the notification link
      if (notification.link) {
        push(notification.link);
      }
    } catch (error) {
      console.error("Failed to process notification click:", error);
    }
  };

  return (
    <Box title="Notifications">
      {notifications?.length === 0 ? (
        <div className="py-4 text-center">No notifications</div>
      ) : (
        notifications?.map((notification: any) => (
          <div
            className="cursor-pointer py-4"
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
          >
            <NotificationComponent key={notification.id} data={notification} />
          </div>
        ))
      )}
    </Box>
  );
};

export default Notifications;

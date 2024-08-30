import Box from "@/features/layout/Box/Box";
import NotificationComponent from "./NotificationComponent";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

type Notification = {
  id: number;
  name: string;
  img: string;
  message: string;
  comment: string;
  time: string;
  date: string;
  read: boolean;
  timePast: string;
};

const Notifications = () => {
  const { notifications } = useGlobalStore();
  const { navigateToOrderDetails } = useNavigation();
  const { setOrderOnReviewId } = useOrderDetailsStore();

  return (
    <Box title="Notifications">
      {notifications?.map((notification: any) => (
        <div
          className="cursor-pointer py-4"
          key={notification.id}
          onClick={() => {
            console.log(notification);
            // setOrderOnReviewId(notification.id);
            // navigateToOrderDetails();
          }}
        >
          <NotificationComponent key={notification.id} data={notification} />
        </div>
      ))}
    </Box>
  );
};

export default Notifications;

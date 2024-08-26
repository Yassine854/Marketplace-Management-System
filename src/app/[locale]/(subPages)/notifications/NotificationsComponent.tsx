import Box from "@/features/layout/Box/Box";
import NotificationComponent from "./NotificationComponent";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

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
  return (
    <Box title="Notifications">
      {notifications.map((notification: any) => (
        <div className="py-4" key={notification.id}>
          <NotificationComponent key={notification.id} data={notification} />
        </div>
      ))}
    </Box>
  );
};

export default Notifications;

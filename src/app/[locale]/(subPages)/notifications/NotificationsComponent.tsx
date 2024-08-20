import { IconClock, IconMessageDots } from "@tabler/icons-react";

import Box from "@/features/layout/Box";
import Image from "next/image";

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

type NotificationsData = {
  today: Notification[];
  yesterday: Notification[];
};

const notificationsData: NotificationsData = {
  today: [
    {
      id: 1,
      name: "Jane Cooper",
      img: "/images/user-big-1.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: false,
      timePast: "20 Min ago",
    },
    {
      id: 2,
      name: "Arlene McCoy",
      img: "/images/user-big-2.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: true,
      timePast: "20 Min ago",
    },
    {
      id: 3,
      name: "Kathryn Murphy",
      img: "/images/user-big-3.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: false,
      timePast: "20 Min ago",
    },
  ],
  yesterday: [
    {
      id: 4,
      name: "Jenny Wilson",
      img: "/images/user-big-4.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: false,
      timePast: "20 Min ago",
    },
    {
      id: 5,
      name: "Annette Black",
      img: "/images/user-big-5.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: true,
      timePast: "20 Min ago",
    },
    {
      id: 6,
      name: "Dianne Russell",
      img: "/images/user-big-6.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: true,
      timePast: "20 Min ago",
    },
    {
      id: 7,
      name: "Brooklyn Simmons",
      img: "/images/user-big-7.png",
      message: "Mentioned you in a comment",
      comment: "Well done! Proud of you",
      time: "05:20 PM",
      date: "August 8, 2023",
      read: false,
      timePast: "20 Min ago",
    },
  ],
};

const Notifications = () => {
  return (
    <Box title="Notifications">
      {Object.keys(notificationsData).map((key) => (
        <div key={key}>
          <p className="px-6 py-4 font-semibold">{key}</p>
          <div>
            {notificationsData[key as keyof NotificationsData].map(
              ({
                id,
                comment,
                date,
                img,
                message,
                name,
                read,
                time,
                timePast,
              }) => (
                <div
                  key={id}
                  className={`rounded-xl p-4 md:p-6 ${
                    !read && "bg-primary/5 dark:bg-bg3"
                  } mb-4 flex flex-wrap items-start gap-4 border border-n30 last:mb-0 dark:border-n500 md:gap-6`}
                >
                  <Image
                    src={img}
                    width={48}
                    className="rounded-full"
                    height={48}
                    alt="img"
                  />
                  <div className="grow">
                    <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-4">
                      <p className="text-xl font-medium">{name}</p>
                      <span className="text-sm">{timePast}</span>
                    </div>
                    <div className="bb-dashed mb-5 flex gap-1 pb-5">
                      <IconMessageDots />
                      <div className="flex flex-wrap items-center gap-1 text-sm">
                        <span>{message}</span>
                        <span className="font-medium">{comment}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock />
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{time}</p>
                        <span className="text-xs">{date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </Box>
  );
};

export default Notifications;

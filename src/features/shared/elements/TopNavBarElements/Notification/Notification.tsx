import { IconBell } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
const notifications = [
  {
    id: 1,
    name: "Benjamin ",
    img: "/images/user.png",
    activity: "Sent a message",
    time: "1 hour ago",
  },
  {
    id: 2,
    name: "William ",
    img: "/images/user-3.png",
    activity: "Left a comment",
    time: "2 hour ago",
  },
  {
    id: 3,
    name: "Samuel",
    img: "/images/user-2.png",
    activity: "Left a comment",
    time: "3 hour ago",
  },
  {
    id: 4,
    name: "Scott",
    img: "/images/user-4.png",
    activity: "Uploaded a file",
    time: "Yesterday",
  },
  {
    id: 5,
    name: "David",
    img: "/images/user-5.png",
    activity: "Left a comment",
    time: "Yesterday",
  },
];
const Notification = ({ isWhite }: { isWhite?: boolean }) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className={` rounded-full p-2 sm:p-3 ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconBell />
      </button>
      <div
        className={`absolute top-full rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 max-sm:origin-top ltr:max-sm:-right-[142px] ltr:sm:right-0 ltr:sm:origin-top-right rtl:max-sm:-left-[142px] rtl:sm:left-0 rtl:sm:origin-top-left ${
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
        <ul className="flex w-[310px] flex-col p-4">
          {notifications.map(({ id, activity, img, name, time }) => (
            <div
              key={id}
              className="flex cursor-pointer gap-2 rounded-md p-2 duration-300 hover:bg-primary/10"
            >
              <Image
                src={img}
                width={40}
                height={40}
                className="rounded-full"
                alt="img"
              />
              <div className="text-sm">
                <div className="flex gap-1">
                  <span className="font-medium">{name}</span>
                  <span>{activity}</span>
                </div>
                <span className="text-xs text-n100 dark:text-n50">{time}</span>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

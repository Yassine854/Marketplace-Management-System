"use client";

import { IconBell } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import useDropdown from "../../utils/useDropdown";
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
        className={` p-2 sm:p-3 rounded-full ${
          isWhite
            ? "bg-n0 dark:bg-bg4 border border-n30 dark:border-n500"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconBell />
      </button>
      <div
        className={`bg-n0 border dark:border-n500 dark:bg-n800 rounded-md max-sm:origin-top ltr:sm:origin-top-right rtl:sm:origin-top-left rtl:max-sm:-left-[142px] ltr:max-sm:-right-[142px] ltr:sm:right-0 rtl:sm:left-0 shadow-lg absolute top-full duration-300 ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-0 invisible"
        }`}
      >
        <div className="flex justify-between items-center lg:px-4 p-3 border-b dark:border-n500">
          <h5 className="h5">Notifications</h5>
          <Link
            href="/notifications"
            onClick={toggleOpen}
            className="text-primary text-sm"
          >
            View All
          </Link>
        </div>
        <ul className="flex flex-col w-[310px] p-4">
          {notifications.map(({ id, activity, img, name, time }) => (
            <div
              key={id}
              className="flex gap-2 cursor-pointer p-2 rounded-md hover:bg-primary/10 duration-300"
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
                <span className="text-n100 dark:text-n50 text-xs">{time}</span>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

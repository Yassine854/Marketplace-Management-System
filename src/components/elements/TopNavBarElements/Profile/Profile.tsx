"use client";

import {
  IconLifebuoy,
  IconLogout,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import useDropdown from "@/utils/useDropdown";

const profileLinks = [
  {
    icon: <IconUser size={18} />,
    url: "/profile",
    title: "My Profile",
  },
  {
    icon: <IconMessage size={18} />,
    url: "/messaging",
    title: "Meassages",
  },
  {
    icon: <IconLifebuoy size={18} />,
    url: "#",
    title: "Help",
  },
  {
    icon: <IconSettings size={18} />,
    url: "/settings",
    title: "Settings",
  },
  {
    icon: <IconLogout size={18} />,
    url: "/login",
    title: "Logout",
  },
];
const Profile = () => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative shrink-0" ref={ref}>
      <div className="w-10 cursor-pointer sm:w-12" onClick={toggleOpen}>
        <Image
          src="/images/user.png"
          className="rounded-full"
          width={48}
          height={48}
          alt="profile img"
        />
      </div>
      <div
        className={`absolute top-full z-20 rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center border-b p-3 text-center dark:border-n500 lg:p-4">
          <Image
            src="/images/user.png"
            width={60}
            height={60}
            className="rounded-full"
            alt="profile img"
          />
          <h6 className="h6 mt-2">William James</h6>
          <span className="text-sm">james@mail.com</span>
        </div>
        <ul className="flex w-[250px] flex-col p-4">
          {profileLinks.map(({ icon, title, url }) => (
            <li key={title}>
              <Link
                href={url}
                className="flex items-center gap-2 rounded-md p-2 duration-300 hover:bg-primary hover:text-n0"
              >
                <span>{icon}</span>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

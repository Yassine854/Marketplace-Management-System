"use client";

import {
  IconBell,
  IconDashboard,
  IconList,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "@/libs/i18nNavigation";

import Divider from "@/components/elements/SidebarElements/Divider";
import Image from "next/image";
import Link from "next/link";
import SidebarButton from "@/components/elements/SidebarElements/SidebarButton";
import SidebarSubMenu from "@/components/elements/SidebarElements/SidebarSubMenu";

const orderStatus = [
  { name: "Open", path: "/orders/open" },
  { name: "Valid", path: "/orders/valid" },
  { name: "Ready", path: "/orders/ready" },
  { name: "Unpaid", path: "/orders/unpaid" },
  { name: "Delivered", path: "/orders/delivered" },
  { name: "Archived", path: "/orders/archived" },
  { name: "Failed", path: "/orders/failed" },
  { name: "Closed", path: "/orders/closed" },
  { name: "All", path: "/orders/all" },
];

const Sidebar = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={`
      sidebar visible fixed 
      left-0 z-[21] h-full w-[280px]
    translate-x-0 bg-n10  shadow-sm duration-300 dark:bg-bg4  ltr:left-0 rtl:right-0`}
    >
      <div className=" pb-8 pt-4">
        <div className="flex  items-center justify-center">
          <Link href="/">
            <Image
              width={260}
              height={12}
              src="/images/Kamioun-logo-text.png"
              alt="logo"
            />
          </Link>
          <button onClick={() => {}} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 mt-6 h-full overflow-y-auto">
        <div className="  px-4 xxl:px-6 xxxl:px-8">
          <Divider />
          <SidebarButton
            isActive={pathname?.includes("dashboard")}
            name={"Dashboard"}
            icon={<IconDashboard />}
            onClick={() => {
              push("/dashboard");
            }}
          />
          <Divider />
          <SidebarSubMenu
            items={orderStatus}
            isActive={pathname?.includes("orders")}
            onClick={() => {
              push("/orders/open");
            }}
          />
          <Divider />
          <SidebarButton
            isActive={pathname?.includes("notifications")}
            name={"Notifications"}
            icon={<IconBell />}
            onClick={() => {
              push("/notifications");
            }}
          />
          <Divider />
          <SidebarButton
            isActive={pathname?.includes("members")}
            name={"Members"}
            icon={<IconUsers />}
            onClick={() => {
              push("/members");
            }}
          />
          <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
          <SidebarButton
            isActive={pathname?.includes("logs")}
            name={"Logs"}
            icon={<IconList />}
            onClick={() => {
              push("/logs");
            }}
          />
          <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

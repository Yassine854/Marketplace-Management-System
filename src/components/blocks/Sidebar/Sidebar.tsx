"use client";

import {
  IconBell,
  IconDashboard,
  IconList,
  IconUsers,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "@/libs/i18nNavigation";

import Divider from "@/components/elements/SidebarElements/Divider";
import Image from "next/image";
import Link from "next/link";
import SidebarButton from "@/components/elements/SidebarElements/SidebarButton";
import SidebarOrdersSubMenu from "@/components/elements/SidebarElements/SidebarOrdersSubMenu";
import SidebarSubMenu from "@/components/elements/SidebarElements/SidebarSubMenu";

const orderStatus = [
  { name: "Open", path: "/orders/open" },
  { name: "Valid", path: "/orders/valid" },
  { name: "Ready", path: "/orders/ready" },
  { name: "div", path: "" },
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
    <aside className="sidebar  no-scrollbar fixed bottom-0 left-0  top-0 z-20 h-screen w-64 overflow-hidden overflow-y-scroll ">
      <div className="fixed  left-0 top-0 z-30 flex h-16 w-64 items-center justify-center bg-n10 p-3">
        <Link href="/">
          <Image
            width={260}
            height={10}
            src="/images/Kamioun-logo-text.png"
            alt="logo"
          />
        </Link>
      </div>

      <div className="  mt-24  px-4 pb-8">
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
        <SidebarOrdersSubMenu
          items={orderStatus}
          isActive={pathname?.includes("orders") && !pathname?.includes("logs")}
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
        <SidebarSubMenu
          isActive={pathname?.includes("access")}
          name="Access Control"
          icon={<IconUsers />}
          items={[
            { name: "Users", path: "/access/users" },
            { name: "Roles", path: "/access/roles" },
          ]}
          onClick={() => {
            push("/access/users");
          }}
        />

        <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
        <SidebarSubMenu
          isActive={pathname?.includes("logs")}
          name="Logs"
          icon={<IconList />}
          items={[
            { name: "Orders", path: "/logs/orders-logs" },
            { name: "Activities", path: "/logs/activities-logs" },
          ]}
          onClick={() => {
            push("/logs/orders-logs");
          }}
        />

        <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
      </div>
    </aside>
  );
};

export default Sidebar;

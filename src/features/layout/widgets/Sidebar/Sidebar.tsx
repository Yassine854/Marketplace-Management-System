import {
  IconX,
  IconBell,
  IconList,
  IconMap2,
  IconUsers,
  IconDashboard,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { statuses } from "./statuses";
import { useSidebar } from "./useSidebar";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "@/features/shared/elements/SidebarElements/SidebarButton";
import SidebarSubMenu from "@/features/shared/elements/SidebarElements/SidebarSubMenu";
import SidebarOrdersSubMenu from "@/features/shared/elements/SidebarElements/SidebarOrdersSubMenu";

const Sidebar = ({
  isAdmin,
  isNoEditUser,
  setSidebar,
  sidebarIsOpen,
  onOrderStatusClick,
}: any) => {
  const {
    push,
    pathname,
    sidebarRef,
    selectedStatus,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
  } = useSidebar(setSidebar);
  return (
    <aside
      className={`z-[21] w-[280px] shadow-sm xxxl:w-[336px] ${
        sidebarIsOpen
          ? "visible translate-x-0"
          : "invisible ltr:-translate-x-full rtl:translate-x-full"
      } sidebar fixed top-0 h-full bg-n0 duration-300 dark:bg-bg4 ltr:left-0 rtl:right-0`}
      ref={sidebarRef}
    >
      <div className={`p-5`}>
        <div className="flex items-center justify-center ">
          <Link href="/">
            <Image
              width={180}
              height={38}
              src="/images/Kamioun-logo-text.png"
              alt="logo"
            />
          </Link>
          <button onClick={() => setSidebar(false)} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12 ">
        <div className="min-h-[70%] px-4 pb-24 xxl:px-6 xxxl:px-8">
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
            isAdmin={isAdmin}
            readyOrdersCount={readyOrdersCount}
            openOrdersCount={openOrdersCount}
            validOrdersCount={validOrdersCount}
            selectedStatus={selectedStatus}
            items={statuses}
            isActive={
              pathname?.includes("order") && !pathname?.includes("logs")
            }
            onClick={() => {
              push("/orders");
            }}
            onSubMenuItemClick={onOrderStatusClick}
          />
          {!isNoEditUser && (
            <>
              <Divider />
              <SidebarButton
                isActive={pathname?.includes("milk-run")}
                name={"Milk Run"}
                icon={<IconMap2 />}
                onClick={() => {
                  push("/milk-run");
                }}
              />
            </>
          )}
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
          {isAdmin && (
            <>
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
            </>
          )}

          {isAdmin && (
            <>
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
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

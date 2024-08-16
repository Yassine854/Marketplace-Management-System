import {
  IconX,
  IconBell,
  IconMap2,
  IconUsers,
  IconReport,
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
  setSidebar,
  isNoEditUser,
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
              alt="logo"
              width={180}
              height={38}
              src="/images/Kamioun-logo-text.png"
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
            onClick={() => {
              push("/dashboard");
            }}
            name={"Dashboard"}
            icon={<IconDashboard />}
            isActive={pathname?.includes("dashboard")}
          />
          <Divider />
          <SidebarOrdersSubMenu
            onClick={() => {
              push("/orders");
            }}
            items={statuses}
            isAdmin={isAdmin}
            selectedStatus={selectedStatus}
            openOrdersCount={openOrdersCount}
            readyOrdersCount={readyOrdersCount}
            validOrdersCount={validOrdersCount}
            onSubMenuItemClick={onOrderStatusClick}
            isActive={
              pathname?.includes("order") && !pathname?.includes("audit-trail")
            }
          />

          <>
            <Divider />

            <SidebarSubMenu
              icon={<IconMap2 />}
              name={"Milk Run"}
              onClick={() => {
                push("/milk-run");
              }}
              isActive={pathname?.includes("milk-run")}
              items={
                isNoEditUser
                  ? [{ name: "History", path: "/milk-run-history" }]
                  : [
                      { name: "Main", path: "/milk-run" },
                      { name: "History", path: "/milk-run-history" },
                    ]
              }
            />
          </>

          <Divider />

          <SidebarSubMenu
            icon={<IconReport />}
            name="Reports"
            onClick={() => {
              push("/reports/agent");
            }}
            isActive={pathname?.includes("reports")}
            items={[
              { name: "Agent", path: "/reports/agent" },
              { name: "Supplier", path: "/reports/supplier" },
            ]}
          />
          <Divider />

          <SidebarButton
            name={"Notifications"}
            icon={<IconBell />}
            onClick={() => {
              push("/notifications");
            }}
            isActive={pathname?.includes("notifications")}
          />
          <Divider />

          {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconUsers />}
                name="Access Control"
                onClick={() => {
                  push("/access/users");
                }}
                isActive={pathname?.includes("access")}
                items={[
                  { name: "Users", path: "/access/users" },
                  { name: "Roles", path: "/access/roles" },
                ]}
              />

              <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
            </>
          )}

          {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconMap2 />}
                name={"Audit Trail"}
                onClick={() => {
                  push("/audit-trail/orders-audit-trail");
                }}
                isActive={pathname?.includes("audit-trail")}
                items={[
                  { name: "Orders", path: "/audit-trail/orders-audit-trail" },
                  {
                    name: "Milk Run",
                    path: "/audit-trail/milkrun-audit-trail",
                  },
                ]}
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

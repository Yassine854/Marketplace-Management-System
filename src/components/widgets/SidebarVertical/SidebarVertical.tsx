import { sidebarData } from "./sidebarData";
import { useWindowSize } from "@/utils/useWindowSize";
import {
  IconChevronRight,
  IconLogout,
  IconX,
  IconDashboard,
  IconBell,
  IconList,
  IconMap2,
  IconUsers,
} from "@tabler/icons-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AnimateHeight from "react-animate-height";
import Divider from "@/components/elements/SidebarElements/Divider";
import Image from "next/image";
import Link from "next/link";
import SidebarButton from "@/components/elements/SidebarElements/SidebarButton";
import SidebarOrdersSubMenu from "@/components/elements/SidebarElements/SidebarOrdersSubMenu";
import SidebarSubMenu from "@/components/elements/SidebarElements/SidebarSubMenu";

import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";

const SidebarVertical = ({
  setSidebar,
  sidebarIsOpen,
}: {
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
}) => {
  const [activeMenu, setActiveMenu] = useState("");
  const path = usePathname();
  const { windowSize } = useWindowSize();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const statuses = [
    "open",
    "valid",
    "closed",
    "shipped",
    "1",
    "3",
    "open",
    "valid",
    "closed",
    "shipped",
    "1",
    "3",
  ];

  const { push } = useRouter();
  const pathname = usePathname();

  const isAdmin = true;
  const readyOrdersCount = 10;
  const openOrdersCount = 10;
  const validOrdersCount = 10;
  const selectedStatus = "open";
  const onOrderStatusClick = () => {};

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const currentWindowSize = window.innerWidth;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (currentWindowSize < 1400) {
          setSidebar(false);
        }
      }
    },
    [setSidebar],
  );

  useEffect(() => {
    sidebarData.map(({ items }: any) =>
      items.map(({ submenus, name }: any) =>
        submenus.map(({ url }: any) =>
          url == path ? setActiveMenu(name) : "",
        ),
      ),
    );
  }, [path]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const isActive = (submenus: any[]) => {
    return submenus.some(({ url }) => path == url);
  };
  return (
    <aside
      className={`z-[21] w-[280px] shadow-sm xxxl:w-[336px] ${
        sidebarIsOpen
          ? "visible translate-x-0"
          : "invisible ltr:-translate-x-full rtl:translate-x-full"
      } sidebar fixed top-0 h-full bg-n0 duration-300 dark:bg-bg4 ltr:left-0 rtl:right-0`}
      ref={sidebarRef}
    >
      <div className={`p-4 xxl:p-6 xxxl:p-[30px]`}>
        <div className="flex items-center justify-center ">
          <Link href="/">
            <Image
              width={260}
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
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12">
        {/* <div className="px-4 pb-24 xxl:px-6 xxxl:px-8">
          {sidebarData.map(({ id, items, title }: any) => (
            <React.Fragment key={id}>
              <p className="border-t-2 border-dashed border-primary/20 py-4 text-xs font-semibold lg:py-6">
                {title}
              </p>
              <ul className="mb-5 flex flex-col gap-2 ">
                {items.map(
                  ({ id, icon, name, submenus }: any) =>
                    submenus && (
                      <li
                        key={id}
                        className={`relative rounded-xl duration-300 ${
                          activeMenu == name && "bg-primary/5 dark:bg-bg3 "
                        }`}
                      >
                        <button
                          onClick={() =>
                            setActiveMenu((p) => (p == name ? "" : name))
                          }
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-2.5 duration-300 hover:bg-primary hover:text-n0 lg:py-3 xxxl:rounded-2xl xxxl:px-6 ${
                            activeMenu == name && "bg-primary text-n0"
                          } ${path == name && "bg-primary text-n0"} ${
                            isActive(submenus) && "bg-primary text-n0"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`text-primary group-hover:text-n0 ${
                                activeMenu == name && " !text-n0"
                              } ${isActive(submenus) && " !text-n0"}`}
                            >
                              {icon}
                            </span>
                            <span className="text-sm font-medium lg:text-base">
                              {name}
                            </span>
                          </span>
                          <IconChevronRight
                            className={`h-5 w-5 transition-transform duration-300 lg:h-6 lg:w-6 rtl:rotate-180 ${
                              activeMenu == name &&
                              "ltr:rotate-90 rtl:rotate-90"
                            }`}
                          />
                        </button>
                        <AnimateHeight height={activeMenu == name ? "auto" : 0}>
                          <ul className={`px-3 py-3 4xl:px-5`}>
                            {submenus.map(({ title, url }: any) => (
                              <li
                                onClick={() => {
                                  setActiveMenu(name);
                                  windowSize! < 1400 &&
                                    setSidebar(!sidebarIsOpen);
                                }}
                                key={title}
                              >
                                <Link
                                  className={`block px-3 py-2.5 text-sm font-medium capitalize duration-300 hover:text-primary md:py-3 lg:text-base xxxl:px-6 ${
                                    path == url && "text-primary"
                                  }`}
                                  href={url}
                                >
                                  <span className="pr-1">•</span> {title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AnimateHeight>
                      </li>
                    ),
                )}
              </ul>
            </React.Fragment>
          ))}
        </div> */}
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
              pathname?.includes("orders") && !pathname?.includes("logs")
            }
            onClick={() => {
              push("/orders");
            }}
            onSubMenuItemClick={onOrderStatusClick}
          />
          <Divider />
          <SidebarButton
            isActive={pathname?.includes("milk-run")}
            name={"Milk Run"}
            icon={<IconMap2 />}
            onClick={() => {
              push("/milk-run");
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

        {/* <div className="px-4  xxl:px-6 xxxl:px-8  ">
          <Divider />
          <SidebarButton
            isActive={pathname?.includes("milk-run")}
            name={"Logout"}
            icon={<IconLogout />}
            onClick={() => {
              push("/milk-run");
            }}
          />
          <Divider />
        </div>
     */}
      </div>
    </aside>
  );
};

export default SidebarVertical;

"use client";

import { IconChevronRight, IconLogout, IconX } from "@tabler/icons-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AnimateHeight from "react-animate-height";
import Image from "next/image";
import { Link } from "nextjs13-progress";
import { sidebarData } from "../../../public/data/sidebarData";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import useWindowSize from "../../utils/useWindowSize";

const SidebarVertical = () => {
  const { push } = useRouter();
  const sidebarIsOpen = true;
  const setSidebar = () => {};
  const [activeMenu, setActiveMenu] = useState("");
  const path = usePathname();
  const { windowSize } = useWindowSize();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const currentWindowSize = window.innerWidth;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (currentWindowSize < 1400) {
          //setSidebar(false);
        }
      }
    },
    [setSidebar]
  );

  useEffect(() => {
    sidebarData.map(({ items }) =>
      items.map(({ submenus, name }) =>
        submenus.map(({ url }) => (url == path ? setActiveMenu(name) : ""))
      )
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
      className={`w-[280px] xxxl:w-[336px] shadow-sm z-[21] ${
        sidebarIsOpen
          ? "translate-x-0 visible"
          : "ltr:-translate-x-full rtl:translate-x-full invisible"
      } duration-300 sidebar fixed ltr:left-0 rtl:right-0 h-full bg-n0 dark:bg-bg4 top-0`}
      ref={sidebarRef}
    >
      <div className={`p-4 xxl:p-6 xxxl:p-[30px]`}>
        <div className="flex justify-between items-center">
          {/* <Link href="/"> */}
          <Image
            width={174}
            height={38}
            src="/images/logo-with-text.png"
            alt="logo"
          />
          {/* </Link> */}
          <button onClick={() => {}} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto fixed right-0 left-0 h-full">
        <div className="px-4 xxl:px-6 xxxl:px-8 pb-24">
          {sidebarData.map(({ id, items, title }) => (
            <React.Fragment key={id}>
              <p className="text-xs font-semibold py-4 lg:py-6 border-t-2 border-dashed border-primary/20">
                {title}
              </p>
              <ul className="mb-5 flex flex-col gap-2 ">
                {items.map(
                  ({ id, icon, name, submenus }) =>
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
                          className={`px-4 w-full group flex justify-between items-center xxxl:px-6 py-2.5 lg:py-3 rounded-xl xxxl:rounded-2xl hover:bg-primary hover:text-n0 duration-300 ${
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
                            <span className="text-sm lg:text-base font-medium">
                              {name}
                            </span>
                          </span>
                          <IconChevronRight
                            className={`duration-300 w-5 h-5 lg:w-6 lg:h-6 rtl:rotate-180 transition-transform ${
                              activeMenu == name &&
                              "ltr:rotate-90 rtl:rotate-90"
                            }`}
                          />
                        </button>
                        <AnimateHeight height={activeMenu == name ? "auto" : 0}>
                          <ul className={`px-3 4xl:px-5 py-3`}>
                            {submenus.map(({ title, url }) => (
                              <li
                                onClick={() => {
                                  setActiveMenu(name);
                                  // windowSize! < 1400 &&
                                  //  setSidebar(!sidebarIsOpen)
                                }}
                                key={title}
                              >
                                {/* <Link
                                  className={`font-medium block py-2.5 md:py-3 text-sm lg:text-base hover:text-primary duration-300 capitalize px-3 xxxl:px-6 ${
                                    path == url && 'text-primary'
                                  }`}
                                  href={url}
                                > */}
                                <span className="pr-1">•</span> {title}
                                {/* </Link> */}
                              </li>
                            ))}
                          </ul>
                        </AnimateHeight>
                      </li>
                    )
                )}
              </ul>
            </React.Fragment>
          ))}
        </div>
        <div className="px-4 xxl:px-6 xxxl:px-8 pb-28">
          {/* <Link
            href="/login-1"
            className={`px-4 w-full group flex justify-between items-center xxxl:px-6 py-2.5 lg:py-3 rounded-2xl hover:bg-primary hover:text-n0 duration-300 `}
          > */}
          <span className="flex items-center gap-2">
            <span className={`text-primary group-hover:text-n0 `}>
              <IconLogout className="w-5 h-5 lg:w-6 lg:h-6" />
            </span>
            <span
              className="text-sm lg:text-base font-medium pointer cursor-pointer	"
              onClick={() => {
                push("/login");
              }}
            >
              Log Out
            </span>
          </span>
          {/* </Link> */}
        </div>
      </div>
    </aside>
  );
};

export default SidebarVertical;

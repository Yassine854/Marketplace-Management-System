"use client";

import AnimateHeight from "react-animate-height";
import { IconChevronRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SidebarElement = ({ items }: any) => {
  const [activeMenu, setActiveMenu] = useState("");
  const path = usePathname();
  const isActive = (submenus: any[]) => {
    return submenus.some(({ url }) => path == url);
  };

  return (
    <div>
      <p className="border-t-2 border-dashed border-primary/20 py-4 text-xs font-semibold lg:py-6"></p>
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
                  onClick={() => setActiveMenu((p) => (p == name ? "" : name))}
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
                      activeMenu == name && "ltr:rotate-90 rtl:rotate-90"
                    }`}
                  />
                </button>
                <AnimateHeight height={activeMenu == name ? "auto" : 0}>
                  <ul className={`px-3 py-3 4xl:px-5`}>
                    {submenus.map(({ title, url }: any) => (
                      <li
                        onClick={() => {
                          setActiveMenu(name);
                        }}
                        key={title}
                      >
                        <div
                          className={`block cursor-pointer px-3 py-2.5 text-sm font-medium capitalize duration-300 hover:text-primary md:py-3 lg:text-base xxxl:px-6 ${
                            path == url && "text-primary"
                          }`}
                        >
                          <span className="pr-1">•</span> {title}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AnimateHeight>
              </li>
            ),
        )}
      </ul>
    </div>
  );
};

export default SidebarElement;

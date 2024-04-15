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
      <p className="text-xs font-semibold py-4 lg:py-6 border-t-2 border-dashed border-primary/20"></p>
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
                      activeMenu == name && "ltr:rotate-90 rtl:rotate-90"
                    }`}
                  />
                </button>
                <AnimateHeight height={activeMenu == name ? "auto" : 0}>
                  <ul className={`px-3 4xl:px-5 py-3`}>
                    {submenus.map(({ title, url }: any) => (
                      <li
                        onClick={() => {
                          setActiveMenu(name);
                        }}
                        key={title}
                      >
                        <div
                          className={`cursor-pointer font-medium block py-2.5 md:py-3 text-sm lg:text-base hover:text-primary duration-300 capitalize px-3 xxxl:px-6 ${
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
            )
        )}
      </ul>
    </div>
  );
};

export default SidebarElement;

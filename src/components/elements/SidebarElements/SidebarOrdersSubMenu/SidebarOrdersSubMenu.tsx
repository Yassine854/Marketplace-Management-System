"use client";

import AnimateHeight from "react-animate-height";
import Divider from "@/components/elements/SidebarElements/Divider";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { useSidebarOrdersSubMenu } from "./useSidebarOrdersSubMenu";

const SidebarSubMenu = ({ isActive = false, onClick, items }: any) => {
  const {
    isOpen,
    setIsOpen,
    openOrdersCount,
    readyOrdersCount,
    validOrdersCount,
    pathname,
    push,
  } = useSidebarOrdersSubMenu(isActive);

  return (
    <div className="flex flex-col gap-2 ">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton
          onClick={() => {
            if (!isActive) {
              onClick();
            } else {
              setIsOpen(!isOpen);
            }
          }}
          isActive={isActive}
          withSubMenu
          isOpen={isOpen}
        />
        <AnimateHeight height={isOpen ? "auto" : 0}>
          <ul className={`px-3 py-3 4xl:px-5`}>
            {items.map(({ name, path }: any) => {
              if (name == "div") {
                return <Divider key={name} />;
              } else {
                let nameAndCount;
                if (openOrdersCount && name == "Open")
                  nameAndCount = name + " " + "(" + openOrdersCount + ")";
                if (validOrdersCount && name == "Valid")
                  nameAndCount = name + " " + "(" + validOrdersCount + ")";
                if (readyOrdersCount && name == "Ready")
                  nameAndCount = name + " " + "(" + readyOrdersCount + ")";
                return (
                  <SidebarSubMenuItem
                    key={name}
                    name={nameAndCount ? nameAndCount : name}
                    onClick={() => push(path)}
                    isActive={pathname?.includes(path)}
                  />
                );
              }
            })}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSubMenu;

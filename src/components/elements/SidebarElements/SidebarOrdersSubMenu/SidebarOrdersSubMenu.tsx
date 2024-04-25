"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/libs/i18nNavigation";

import AnimateHeight from "react-animate-height";
import Divider from "@/components/elements/SidebarElements/Divider";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";

const SidebarSubMenu = ({ isActive = false, onClick, items }: any) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

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
        />
        <AnimateHeight height={isOpen ? "auto" : 0}>
          <ul className={`px-3 py-3 4xl:px-5`}>
            {items.map(({ name, path }: any) => {
              if (name == "div") {
                return <Divider key={name} />;
              } else {
                return (
                  <SidebarSubMenuItem
                    key={name}
                    name={name}
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

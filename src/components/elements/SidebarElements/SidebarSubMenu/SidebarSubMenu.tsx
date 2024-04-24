"use client";

import { usePathname, useRouter } from "@/libs/i18nNavigation";

import AnimateHeight from "react-animate-height";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";

const SidebarSubMenu = ({ isActive = false, onClick, items }: any) => {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-2 ">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton
          onClick={() => onClick()}
          isActive={isActive}
          withSubMenu
        />
        <AnimateHeight height={isActive ? "auto" : 0}>
          <ul className={`px-3 py-3 4xl:px-5`}>
            {items.map(({ name, path }: any) => (
              <SidebarSubMenuItem
                key={name}
                name={name}
                onClick={() => push(path)}
                isActive={pathname?.includes(path)}
              />
            ))}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSubMenu;

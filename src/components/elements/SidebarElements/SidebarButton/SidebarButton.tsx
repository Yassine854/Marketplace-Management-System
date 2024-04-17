"use client";

import { IconChevronRight, IconPackage } from "@tabler/icons-react";

import { Props } from "./SidebarButton.types";

const SidebarButton = ({ isActive, name, onClick, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl px-4 py-2.5 duration-300 hover:bg-primary hover:text-n0 lg:py-3 xxxl:rounded-2xl xxxl:px-6 
      ${isActive && "bg-primary text-n0"}
 
      
      
      `}
    >
      <span className="flex items-center gap-2">
        <span
          className={`text-primary group-hover:text-n0 ${
            isActive && " !text-n0"
          } ${isActive && " !text-n0"}`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium lg:text-base">{name}</span>
      </span>
      <IconChevronRight
        className={`h-5 w-5 transition-transform duration-300 lg:h-6 lg:w-6 rtl:rotate-180 ${
          isActive && "ltr:rotate-90 rtl:rotate-90"
        }`}
      />
    </button>
  );
};

SidebarButton.defaultProps = {
  isActive: false,
  name: "Orders",
  onclick: () => {},
  icon: <IconPackage className="h-5 w-5 lg:h-6 lg:w-6" />,
};

export default SidebarButton;

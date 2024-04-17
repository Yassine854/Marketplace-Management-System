"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { isAbsolute } from "path";
import { usePathname } from "next/navigation";
import { useState } from "react";

const subMenu = [
  { name: "Open", path: "/open" },
  { name: "Valid", path: "/valid" },
  { name: "Ready", path: "/ready" },
  { name: "Unpaid", path: "/unpaid" },
  { name: "Delivered", path: "/delivered" },
  { name: "Archived", path: "/archived" },
  { name: "Failed", path: "./failed" },
  { name: "Closed", path: "./closed" },
  { name: "All", path: "/all" },
];
const item = {
  id: 9,
  name: "Orders",
  icon: <IconShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" />,
  submenus: [{ title: "Ecommerce", path: "/dashboards/ecommerce" }],
};
const SidebarOrders = ({ isActive }: any) => {
  const { id, name } = item;
  const [activeMenu, setActiveMenu] = useState("");
  const path = usePathname();

  return (
    <div>
      <ul className=" flex flex-col gap-2 ">
        <li
          key={id}
          className={`relative rounded-xl duration-300 ${
            activeMenu == name && "bg-primary/5 dark:bg-bg3 "
          }`}
        >
          <SidebarButton isActive={isActive} />

          <ul className={`px-3 py-3 4xl:px-5`}>
            <li
              onClick={() => {
                setActiveMenu(name);
              }}
              key={1}
            >
              {subMenu.map((item, index) => (
                <SidebarSubMenuItem
                  isActive={false}
                  key={index}
                  onClick={() => {}}
                  name={item.name}
                />
              ))}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

SidebarOrders.defaultProps = {
  isActive: false,
};
export default SidebarOrders;

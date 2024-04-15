"use client";

import { IconLogout, IconX } from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import SidebarElement from "@/components/elements/SidebarElement";
import { sidebarData } from "./sidebarData";
import { useRouter } from "next/navigation";

///
const Sidebar = () => {
  const { push } = useRouter();

  return (
    <aside
      className={`w-[280px] xxxl:w-[336px] shadow-sm z-[21] 
          translate-x-0 visible
          
    duration-300 sidebar fixed ltr:left-0 rtl:right-0 h-full bg-n0 dark:bg-bg4 top-0`}
    >
      .
      <div className={`p-4 xxl:p-6 xxxl:p-[30px]`}>
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              width={174}
              height={38}
              src="/images/logo-with-text.png"
              alt="logo"
            />
          </Link>
          <button onClick={() => {}} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto fixed right-0 left-0 h-full">
        <div className="px-4 xxl:px-6 xxxl:px-8 pb-24">
          {sidebarData.map(({ id, items, title }) => (
            <SidebarElement items={items} key={id} />
          ))}
        </div>
        <div className="px-4 xxl:px-6 xxxl:px-8 pb-28">
          <div
            className={`px-4 w-full group flex justify-between items-center xxxl:px-6 py-2.5 lg:py-3 rounded-2xl hover:bg-primary hover:text-n0 duration-300 `}
          >
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
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

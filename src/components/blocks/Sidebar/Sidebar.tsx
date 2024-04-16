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
      className={`
      
      sidebar visible fixed 
      
      left-0 top-0 top-0 z-[21] 
          h-full w-[280px]
          
    translate-x-0 bg-n0  shadow-sm duration-300 dark:bg-bg4 xxxl:w-[336px] ltr:left-0 rtl:right-0`}
    >
      .
      <div className={`p-4 xxl:p-6 xxxl:p-[30px]`}>
        <div className="flex items-center justify-between">
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
      <div className="fixed left-0 right-0 h-full overflow-y-auto">
        <div className="px-4 pb-24 xxl:px-6 xxxl:px-8">
          {sidebarData.map(({ id, items, title }) => (
            <SidebarElement items={items} key={id} />
          ))}
        </div>
        <div className="px-4 pb-28 xxl:px-6 xxxl:px-8">
          <div
            className={`group flex w-full items-center justify-between rounded-2xl px-4 py-2.5 duration-300 hover:bg-primary hover:text-n0 lg:py-3 xxxl:px-6 `}
          >
            <span className="flex items-center gap-2">
              <span className={`text-primary group-hover:text-n0 `}>
                <IconLogout className="h-5 w-5 lg:h-6 lg:w-6" />
              </span>
              <span
                className="pointer cursor-pointer text-sm font-medium lg:text-base	"
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

"use client";

import { IconHome, IconList, IconUsers, IconX } from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import SidebarButton from "@/components/elements/SidebarElements/SidebarButton";
import SidebarOrders from "@/components/elements/SidebarElements/SidebarOrders";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { push, replace } = useRouter();

  return (
    <aside
      className={`
      sidebar visible fixed 
      left-0 z-[21] h-full w-[280px]
    translate-x-0 bg-n0  shadow-sm duration-300 dark:bg-bg4 xxxl:w-[336px] ltr:left-0 rtl:right-0`}
    >
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
        <div className="  px-4 xxl:px-6 xxxl:px-8">
          <p className="mb-2 mt-2 border-t-2  border-dashed border-primary/20 text-xs font-semibold " />
          <SidebarButton
            isActive={false}
            name={"Home"}
            icon={<IconHome />}
            onClick={() => {
              push("/dashboard");
            }}
          />
          <p className="mb-2 mt-2 border-t-2  border-dashed border-primary/20 text-xs font-semibold " />
          <SidebarOrders isActive={true} />
          <p className="mb-2 mt-2 border-t-2  border-dashed border-primary/20 text-xs font-semibold " />

          <SidebarButton
            isActive={false}
            name={"Members"}
            icon={<IconUsers />}
            onClick={() => {
              push("/dashboard/members");
            }}
          />
          <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
          <SidebarButton
            isActive={false}
            name={"Logs"}
            icon={<IconList />}
            onClick={() => {
              push("/dashboard/logs");
            }}
          />
          <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

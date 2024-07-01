import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/widgets/SidebarVertical";
import TopNav from "@/components/widgets/TopNavbar";
import { useOrdersStore } from "@/stores/ordersStore";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { setStatus } = useOrdersStore();

  const { user } = useAuth();

  //@ts-ignore
  const isAdmin = user?.roleCode === "ADMIN";

  useEffect(() => {
    if (window.innerWidth > 1400) {
      setSidebarIsOpen(true);
    } else {
      setSidebarIsOpen(false);
    }
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        setSidebarIsOpen(false);
      } else {
        setSidebarIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      <TopNav setSidebar={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />

      <Sidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebar={setSidebarIsOpen}
        isAdmin={isAdmin}
        onOrderStatusClick={(status: any) => {
          setStatus(status);
        }}
      />
      <div className="flex h-full flex-grow ">
        <div
          className={`transition-all duration-300 ease-in-out ${
            sidebarIsOpen
              ? "h-full  ltr:xxl:w-[280px] ltr:xxxl:w-[336px] rtl:xxl:w-[280px] rtl:xxxl:w-[336px]"
              : "h-full w-0"
          }`}
        />
        <div className="b flex h-full flex-grow">{children}</div>
      </div>
    </div>
  );
}

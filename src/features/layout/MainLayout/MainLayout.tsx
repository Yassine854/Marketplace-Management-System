import { useEffect, useState } from "react";
import Sidebar from "@/features/layout/widgets/Sidebar";
import TopNav from "@/features/layout/widgets/TopNavbar";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setStatus } = useOrdersStore();
  const { navigateToOrders } = useNavigation();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { isAdmin, isNoEdit } = useGlobalStore();

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
        isAdmin={isAdmin}
        isNoEdit={isNoEdit}
        sidebarIsOpen={sidebarIsOpen}
        setSidebar={setSidebarIsOpen}
        onOrderStatusClick={(status: any) => {
          setStatus(status);
          navigateToOrders();
        }}
      />
      <div className="flex h-full flex-grow ">
        <div
          className={`transition-all duration-300 ease-in-out  overflow-x-hidden${
            sidebarIsOpen
              ? "h-full  ltr:xxl:w-[280px] ltr:xxxl:w-[336px] rtl:xxl:w-[280px] rtl:xxxl:w-[336px]"
              : "h-full w-0"
          }`}
        />
        <div className="flex h-full flex-grow">{children}</div>
      </div>
    </div>
  );
}

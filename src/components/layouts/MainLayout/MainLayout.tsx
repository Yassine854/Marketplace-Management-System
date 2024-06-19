import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useStatusStore } from "@/stores/statusStore";
import Sidebar from "@/components/widgets/SidebarVertical";
import TopNav from "@/components/widgets/TopNavbar";
import { useLayout } from "@/utils/LayoutContext";
import { useWindowSize } from "@/utils/useWindowSize";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { layout } = useLayout();
  const { windowSize } = useWindowSize();
  const { user } = useAuth();
  const { status, setStatus } = useStatusStore();
  const {
    readyOrdersCount,
    openOrdersCount,
    validOrdersCount,
    selectedStatus,
  } = useOrders(status);

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
    <>
      <TopNav setSidebar={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />

      <Sidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebar={setSidebarIsOpen}
        isAdmin={isAdmin}
        readyOrdersCount={readyOrdersCount}
        openOrdersCount={openOrdersCount}
        validOrdersCount={validOrdersCount}
        selectedStatus={selectedStatus}
        onOrderStatusClick={setStatus}
      />

      <div
        className={`bg-primary/5 pt-[72px] transition-all duration-500 dark:bg-bg3 md:pt-20 xl:pt-[98px]  ${
          sidebarIsOpen &&
          layout == "Vertical" &&
          "ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]"
        } ${
          sidebarIsOpen &&
          layout == "Two Column" &&
          "ltr:xxl:ml-[280px] ltr:xxxl:ml-[360px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[360px]"
        } ${
          sidebarIsOpen && layout == "Hovered" && "ltr:xxl:ml-20 rtl:xxl:mr-20"
        } ${layout == "Horizontal" && windowSize! > 1400 && "!pt-[172px]"}`}
      >
        <div
          className={`px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6  ${
            layout == "Horizontal" && "mx-auto max-w-[1700px] xxl:px-3"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

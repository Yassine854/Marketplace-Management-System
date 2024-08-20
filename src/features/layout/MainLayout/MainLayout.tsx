import { useMainLayout } from "./useMainLayout";
import Sidebar from "@/features/layout/widgets/Sidebar";
import TopNav from "@/features/layout/widgets/TopNavbar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    isAdmin,
    setStatus,
    isNoEditUser,
    sidebarIsOpen,
    navigateToOrders,
    setSidebarIsOpen,
  } = useMainLayout();

  return (
    <div className="h-screen w-screen">
      <TopNav setSidebar={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />

      <Sidebar
        isAdmin={isAdmin}
        isNoEditUser={isNoEditUser}
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
};

export default MainLayout;

import { useEffect, useState } from "react";
import Sidebar from "@/features/layout/widgets/Sidebar";
import TopNav from "@/features/layout/widgets/TopNavbar";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

//To Refactor
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const { setStatus } = useOrdersStore();
  const { navigateToOrders } = useNavigation();
  const { isAdmin, isNoEditUser, isMultipleStoreAccessUser } = useGlobalStore();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const {
    setStoreId,
    setIsNoEditUser,
    setIsAdmin,
    storeId,
    setIsMultipleStoreAccessUser,
  } = useGlobalStore();

  useEffect(() => {
    //@ts-ignore
    if (user?.roleId !== "5") {
      setIsNoEditUser(false);
      setIsMultipleStoreAccessUser(false);
    }
  }, [storeId]);

  useEffect(() => {
    //@ts-ignore
    if (user?.roleId !== "1") {
      setIsAdmin(false);
    }
  }, [storeId]);

  useEffect(() => {
    //@ts-ignore
    switch (user?.roleId) {
      case "1":
        setStoreId("1");
        setIsAdmin(true);

        break;
      case "5":
        setStoreId("1");
        setIsMultipleStoreAccessUser(true);
        setIsNoEditUser(true);
        break;
      case "2":
        setStoreId("2");
        break;
      case "3":
        setStoreId("2");
        break;
      case "4":
        setStoreId("4");
        break;
    }
  }, [user, setStoreId]);

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

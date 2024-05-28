import { Children } from "@/types/children";
import Sidebar from "@/components/widgets/Sidebar";
import TopNavBar from "@/components/widgets/TopNavBar";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useStatusStore } from "@/stores/statusStore";

const MainLayout = ({ children }: Children) => {
  const { user } = useAuth();
  const { status, setStatus } = useStatusStore();
  const {
    readyOrdersCount,
    openOrdersCount,
    validOrdersCount,
    selectedStatus,
  } = useOrders(status);

  //@ts-ignore
  const isAdmin = user?.role === "admin";
  return (
    <div className="h-screen w-screen bg-n10 ">
      <TopNavBar />
      <Sidebar
        isAdmin={isAdmin}
        readyOrdersCount={readyOrdersCount}
        openOrdersCount={openOrdersCount}
        validOrdersCount={validOrdersCount}
        selectedStatus={selectedStatus}
        onOrderStatusClick={setStatus}
      />
      <div className="fixed bottom-0 left-64 right-0  top-16 z-10  rounded-xl bg-n30 p-1.5">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

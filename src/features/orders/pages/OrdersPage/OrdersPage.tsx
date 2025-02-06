import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import OrdersPagination from "../../widgets/OrdersPagination";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import { useOrdersData } from "../../hooks/queries/useOrdersData";
import Divider from "@/features/shared/elements/SidebarElements/Divider";

const OrdersPage = () => {
  const { orders } = useOrdersData();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center   ">
        <OrdersToolBar />
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3">
        <OrdersTable />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        <OrdersPagination />
      </div>
    </div>
  );
};

export default OrdersPage;

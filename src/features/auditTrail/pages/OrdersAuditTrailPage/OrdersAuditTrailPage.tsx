import OrdersTable from "../../tables/OrdersAuditTrailTable";
import Pagination from "../../widgets/Pagination";
//import AnyMatchingResults from "../../widgets/AnyMatchingResults";
//import { useOrdersData } from "../../hooks/queries/useOrdersData";
import Divider from "@/features/shared/elements/SidebarElements/Divider";

const logs = [
  {
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
];

const OrdersPage = () => {
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <p className="my-4 text-xl font-bold">Orders Audit Trail</p>
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3 pb-24">
        <OrdersTable />
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        <Pagination />
      </div>
    </div>
  );
};

export default OrdersPage;

import Table from "../../tables/OrdersAuditTrailTable";
import Pagination from "../../widgets/Pagination";
import Divider from "@/features/shared/elements/SidebarElements/Divider";

const trails = [
  {
    id: "1",
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "2",
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "3",
    username: "admin",
    orderId: "12342134",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "4",
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
        <Table trails={trails} isLoading={false} />
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        <Pagination numberOfItems={10000} />
      </div>
    </div>
  );
};

export default OrdersPage;

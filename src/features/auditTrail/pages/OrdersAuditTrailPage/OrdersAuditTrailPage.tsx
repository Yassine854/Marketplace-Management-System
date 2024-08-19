import Pagination from "../../widgets/Pagination";
import Table from "../../tables/OrdersAuditTrailTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useGetOrdersAuditTrail } from "../../hooks/useGetOrdersAuditTrail";

const OrdersAuditTrailPage = () => {
  const { auditTrail } = useGetOrdersAuditTrail();

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center border-t-4  ">
        <p className="my-4 text-xl font-bold">Orders Audit Trail</p>
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3 pb-24">
        <Table auditTrail={auditTrail} isLoading={false} />
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        <Pagination numberOfItems={10000} />
      </div>
    </div>
  );
};

export default OrdersAuditTrailPage;

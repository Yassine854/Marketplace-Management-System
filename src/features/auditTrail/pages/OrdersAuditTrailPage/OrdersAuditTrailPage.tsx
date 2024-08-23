import { useEffect } from "react";
import Table from "../../tables/OrdersAuditTrailTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useGetOrdersAuditTrail } from "../../hooks/useGetOrdersAuditTrail";
import OrdersAuditTrailPagination from "@/features/orders/widgets/OrdersAuditTrailPagination";
import { useOrdersAuditTrailTableStore } from "@/features/auditTrail/stores/ordersAuditTrailTableStore";

const OrdersAuditTrailPage = () => {
  const { currentPage, itemsPerPage } = useOrdersAuditTrailTableStore();
  const { auditTrail, isLoading, refetch } = useGetOrdersAuditTrail(
    currentPage - 1,
  );

  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage, refetch]);

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between">
      <div className="mt-[4.8rem] flex w-full items-center justify-center border-t-4">
        <p className="my-4 text-xl font-bold">Orders Audit Trail</p>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3 pb-24">
        <Table auditTrail={auditTrail} isLoading={isLoading} />
      </div>
      <Divider />
      <div className="flex w-full items-center justify-center bg-n0">
        {auditTrail?.length !== 0 && <OrdersAuditTrailPagination />}
      </div>
    </div>
  );
};

export default OrdersAuditTrailPage;

"use client";

import OrdersTable from "@/components/blocks/OrdersTable";
import { useGetOrders } from "@/hooks/queries/useGetOrders";

const OpenOrdersPage = () => {
  const { data, isLoading, error } = useGetOrders({
    status: "open",
    page: 1,
    perPage: 100,
  });

  return (
    <div className="h-ful w-full">
      <OrdersTable orders={data?.orders} total={data?.total} />
    </div>
  );
};
export default OpenOrdersPage;

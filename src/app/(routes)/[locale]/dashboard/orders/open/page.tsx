"use client";

import OrdersTable from "@/components/blocks/OrdersTable";
import { useEffect } from "react";
import { useGetOrders } from "@/hooks/queries/useGetOrders";

const OpenOrdersPage = () => {
  const { data, isLoading } = useGetOrders({
    status: "open",
    page: 1,
    perPage: 10,
  });

  useEffect(() => {
    console.log("🚀 ~ OpenOrdersPage ~ data:", data);
  }, [data]);

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable orders={data?.orders} total={data?.total} />
      )}
    </div>
  );
};

export default OpenOrdersPage;

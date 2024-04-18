"use client";

import OrdersTable from "@/components/blocks/OrdersTable";

const OpenOrdersTemplate = ({ orders, total }: any) => {
  return (
    <div className="h-ful w-full">
      <OrdersTable orders={orders} total={total} />
    </div>
  );
};
export default OpenOrdersTemplate;

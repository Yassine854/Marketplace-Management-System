"use client";

import OrdersLayout from "@/components/layouts/OrdersLayout";
import { useOrders } from "@/hooks/useOrders";

const OrdersPage = () => {
  const { orders, totalOrders, isLoading } = useOrders();

  return (
    <OrdersLayout
      orders={orders}
      totalOrders={totalOrders}
      isLoading={isLoading}
    />
  );
};

export default OrdersPage;

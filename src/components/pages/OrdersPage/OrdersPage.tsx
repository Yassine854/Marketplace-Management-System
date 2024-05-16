"use client";

import OrdersLayout from "@/components/layouts/OrdersLayout";
import { useOrders } from "@/hooks/useOrders";

const OrdersPage = () => {
  const {
    orders,
    totalOrders,
    isLoading,

    setItemsPerPage,
    setCurrentPage,
  } = useOrders();

  return (
    <OrdersLayout
      orders={orders}
      totalOrders={totalOrders}
      isLoading={isLoading}
      onItemsPerPageChanged={setItemsPerPage}
      onPageChanged={setCurrentPage}
    />
  );
};

export default OrdersPage;

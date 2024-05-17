"use client";

import OrdersLayout from "@/components/layouts/OrdersLayout";
import { useOrders } from "@/hooks/useOrders";
import { useStatusStore } from "@/stores/status-store";

const OrdersPage = () => {
  const { status } = useStatusStore();

  const {
    orders,
    totalOrders,
    isLoading,
    setItemsPerPage,
    setCurrentPage,
    setSearch,
  } = useOrders(status);

  return (
    <OrdersLayout
      orders={orders}
      totalOrders={totalOrders}
      isLoading={isLoading}
      onItemsPerPageChanged={setItemsPerPage}
      onPageChanged={setCurrentPage}
      onSearch={setSearch}
    />
  );
};

export default OrdersPage;

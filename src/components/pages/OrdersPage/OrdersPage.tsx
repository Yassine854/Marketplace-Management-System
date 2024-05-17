"use client";

import OrdersTemplate from "@/components/Templates/OrdersTemplate";
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
    <OrdersTemplate
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

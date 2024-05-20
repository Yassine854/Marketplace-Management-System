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
    onSort,
  } = useOrders(status);

  return (
    <OrdersTemplate
      selectedStatus={status}
      orders={orders}
      totalOrders={totalOrders}
      isLoading={isLoading}
      onItemsPerPageChanged={setItemsPerPage}
      onPageChanged={setCurrentPage}
      onSearch={setSearch}
      onSort={onSort}
    />
  );
};

export default OrdersPage;

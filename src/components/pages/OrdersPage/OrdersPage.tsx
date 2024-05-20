"use client";

import OrdersTemplate from "@/components/Templates/OrdersTemplate";
import { useOrders } from "@/hooks/useOrders";
import { useStatusStore } from "@/stores/statusStore";

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
    changeSelectedSort,
    refs,
    onOrderClick,
  } = useOrders(status);

  return (
    <OrdersTemplate
      onOrderClick={onOrderClick}
      refs={refs}
      selectedStatus={status}
      orders={orders}
      totalOrders={totalOrders}
      isLoading={isLoading}
      onItemsPerPageChanged={setItemsPerPage}
      onPageChanged={setCurrentPage}
      onSearch={setSearch}
      changeSelectedSort={changeSelectedSort}
      onSort={onSort}
    />
  );
};

export default OrdersPage;

"use client";

import Box from "@/components/widgets/Box";
import OrdersTable from "@/components/widgets/OrdersWidgets/OrdersTable";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";
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
    onSearch,
    onSort,
    changeSelectedSort,
    refs,
    onOrderClick,
  } = useOrders(status);

  return (
    <Box>
      <OrdersToolBar
        searchRef={refs.searchRef}
        onSearch={onSearch}
        onSort={onSort}
        selectedStatus={status}
        sortRef={refs.sortRef}
      />
      <div className="  overflow-y-scroll  bg-n10 pb-20">
        <OrdersTable
          isLoading={isLoading}
          orders={orders}
          onSort={onSort}
          changeSelectedSort={changeSelectedSort}
          onOrderClick={onOrderClick}
        />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination
          ref={refs.paginationRef}
          selectedStatus={status}
          totalItems={totalOrders}
          onItemsPerPageChanged={setItemsPerPage}
          onPageChanged={setCurrentPage}
        />
      </div>
    </Box>
  );
};

export default OrdersPage;

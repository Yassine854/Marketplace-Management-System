"use client";

import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import Box from "@/components/Layouts/Box";
import OrdersTable from "@/components/widgets/UsersTable";
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
    onSelectAllClick,
    onSelectOrderClick,
    isAllOrdersSelected,
    isSomeOrdersSelected,
  } = useOrders(status);

  return (
    <Box>
      <OrdersToolBar
        searchRef={refs.searchRef}
        onSearch={onSearch}
        onSort={onSort}
        selectedStatus={status}
        sortRef={refs.sortRef}
        selectedOrders
        isSomeOrdersSelected={isSomeOrdersSelected}
      />
      <div className=" flex  w-full flex-grow flex-col overflow-y-scroll bg-n10 pb-24">
        <OrdersTable
          isLoading={isLoading}
          orders={orders}
          onSort={onSort}
          changeSelectedSort={changeSelectedSort}
          onOrderClick={onOrderClick}
          onSelectAllClick={onSelectAllClick}
          onSelectOrderClick={onSelectOrderClick}
          isAllOrdersSelected={isAllOrdersSelected}
        />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>

      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        {orders?.length !== 0 && (
          <Pagination
            ref={refs.paginationRef}
            selectedStatus={status}
            totalItems={totalOrders}
            onItemsPerPageChanged={setItemsPerPage}
            onPageChanged={setCurrentPage}
          />
        )}
      </div>
    </Box>
  );
};

export default OrdersPage;

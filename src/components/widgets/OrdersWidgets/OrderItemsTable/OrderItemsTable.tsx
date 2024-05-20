"use client";

import Box from "../../Box";
import OrderItemsTableHeader from "@/components/elements/TablesElements/OrderLinesTableElements/OrderItemsTableHeader";
import Pagination from "@/components/widgets/OrdersWidgets/Pagination";
import TableBody from "@/components/elements/TablesElements/OrderLinesTableElements/OrderItemsTableBody";
import { tailwind } from "./OrderItemsTable.styles";
import { useEffect } from "react";
import { useOrdersTable } from "./useOrderDetailsTable";

const OrderItemsTable = ({ status = "open" }: { status?: string }) => {
  const title = status.toString() + " " + "Orders";

  const setStatus = (status: string): string => {
    if (status == "ready") {
      return "shipped";
    }
    if (status == "all") {
      return "";
    }

    return status;
  };

  // const {
  //   order,
  //   currentPage,
  //   paginate,
  //   totalOrders,
  //   totalPages,
  //   nextPage,
  //   prevPage,
  //   startIndex,
  //   endIndex,
  //   orders,
  //   isLoading,
  //   itemsPerPage,
  //   setItemsPerPage,
  //   sortOptions,
  //   sortBy,
  //   setSortBy,
  //   setSortOrder,
  //   setSearch,
  //   setSelectedOrders,
  //   selectAllOrders,
  //   selectedOrders,
  //   unSelectAllOrders,
  //   selectOrder,
  //   unSelectOrder,
  //   onRowClick,
  //   actions,
  // } = useOrdersTable(setStatus(status));

  return (
    <Box>
      <div className={tailwind.header}>
        {/* <OrderItemsTableHeader
          title={title}
          sortOptions={sortOptions}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSearch={setSearch}
          selectedOrders={selectedOrders}
        /> */}
      </div>

      <div className={tailwind.main}>
        {/* <TableBody
          order={order}
          onRowClick={onRowClick}
          isLoading={isLoading}
          orders={orders}
          error={""}
          setSortOrder={setSortOrder}
          setSortBy={setSortBy}
          setSelectedOrders={setSelectedOrders}
          selectAllOrders={selectAllOrders}
          unSelectAllOrders={unSelectAllOrders}
          selectOrder={selectOrder}
          unSelectOrder={unSelectOrder}
          actions={actions}
        /> */}
      </div>
      <div className={tailwind.footer} />
    </Box>
  );
};

export default OrderItemsTable;

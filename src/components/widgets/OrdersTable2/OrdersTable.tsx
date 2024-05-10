"use client";

import Box from "../Box";
import OrdersTableBody from "@/components/elements/TablesElements/OpenOrdersTableElements2/OrdersTableBody";
import OrdersTableHeader from "@/components/elements/TablesElements/OpenOrdersTableElements2/OrdersTableHeader";
import Pagination from "@/components/widgets/Pagination";
import { tailwind } from "./OrdersTable.styles";
import { useEffect } from "react";
import { useOrdersTable } from "./useOrdersTable";

const OrdersTable = ({
  status = "open",
  isAdvanced,
  setAdvanced,
}: {
  status?: string;
  isAdvanced: any;
  setAdvanced: any;
}) => {
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

  const {
    currentPage,
    paginate,
    totalOrders,
    totalPages,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    orders,
    isLoading,
    itemsPerPage,
    setItemsPerPage,
    sortOptions,
    sortBy,
    setSortBy,
    setSortOrder,
    setSearch,
    setSelectedOrders,
    selectAllOrders,
    selectedOrders,
    unSelectAllOrders,
    selectOrder,
    unSelectOrder,
    onRowClick,
    actions,
  } = useOrdersTable(setStatus(status));

  return (
    <Box>
      <div className={tailwind.header}>
        <OrdersTableHeader
          title={title}
          sortOptions={sortOptions}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSearch={setSearch}
          selectedOrders={selectedOrders}
          isAdvanced={isAdvanced}
          setAdvanced={setAdvanced}
        />
      </div>

      <div className={tailwind.main}>
        <OrdersTableBody
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
        />
      </div>
      <div className={tailwind.footer}>
        {orders?.length !== 0 && (
          <Pagination
            endIndex={endIndex}
            totalOrders={totalOrders}
            totalPages={totalPages}
            currentPage={currentPage}
            goToPage={paginate}
            nextPage={nextPage}
            prevPage={prevPage}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </div>
    </Box>
  );
};

export default OrdersTable;

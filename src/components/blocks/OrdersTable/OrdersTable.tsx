"use client";

import Box from "../Box";
import OrdersTableBody from "@/components/elements/TablesElements/OrdersTableBody";
import OrdersTableHeader from "@/components/elements/TablesElements/OrdersTableHeader";
import Pagination from "@/components/elements/TablesElements/Pagination";
import { tailwind } from "./OrdersTable.styles";
import { useEffect } from "react";
import { useOrdersTable } from "./useOrdersTable";

const OrdersTable = ({ status = "open" }: { status?: string }) => {
  const title = status.toString() + " " + "Orders";
  const {
    currentPage,
    paginate,
    total,
    totalPages,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    orders,
    isLoading,
    itemsPerPage,
    setItemsPerPage,
  } = useOrdersTable(status);

  useEffect(() => {
    console.log("🚀 ~ OrdersTable ~ orders:", orders);
  }, [orders]);

  return (
    <Box>
      <div className={tailwind.header}>
        <OrdersTableHeader title={title} />
      </div>

      <div className={tailwind.main}>
        <OrdersTableBody isLoading={isLoading} orders={orders} error={""} />
      </div>
      <div className={tailwind.footer}>
        {orders?.length > 0 && (
          <Pagination
            endIndex={endIndex}
            total={total}
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

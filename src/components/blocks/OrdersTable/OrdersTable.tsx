"use client";

import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import Box from "../Box";
import { Order } from "@/types/order";
import OrdersTableHead from "@/components/elements/TablesElements/OrdersTableHead";
import OrdersTableHeader from "@/components/elements/TablesElements/OrdersTableHeader";
import Pagination from "@/components/elements/TablesElements/Pagination";
import TableRow from "@/components/elements/TablesElements/TableRow";
import TableRowSkeleton from "@/components/elements/TablesElements/TableRowSkeleton";
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
        <>
          {!isLoading && !!orders?.length && (
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              className="w-full border-separate overflow-x-scroll whitespace-nowrap border-none pb-16 pt-2 "
            >
              <OrdersTableHead />

              {!isLoading && (
                <tbody>
                  {orders?.map((order: Order) => (
                    <TableRow order={order} key={order.id} onClick={() => {}} />
                  ))}
                </tbody>
              )}
              {isLoading && (
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <TableRowSkeleton key={i} number={6} />
                  ))}
                </tbody>
              )}
            </table>
          )}
        </>
        <>
          {isLoading && (
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              className="w-full border-separate overflow-x-scroll whitespace-nowrap border-none pb-16 pt-2 "
            >
              <OrdersTableHead />
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <TableRowSkeleton key={i} number={6} />
                ))}
              </tbody>
            </table>
          )}
        </>
        <> {!isLoading && !orders?.length && <AnyMatchingResults />}</>
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

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

  const skeleton = Array.apply(null, Array(itemsPerPage)).map((e, i) => {
    i: i;
  });
  return (
    <Box>
      <div className={tailwind.header}>
        <OrdersTableHeader title={title} />
      </div>
      <div className={tailwind.main}>
        <>
          {!!orders?.length && (
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
                  {skeleton.map((e, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              )}
            </table>
          )}
        </>
        <>{!isLoading && !orders?.length && <AnyMatchingResults />}</>
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
      {/* <OrdersTableHeader title={title} />
      <div className="mb-6 overflow-x-auto rounded-2xl bg-primary/5  dark:bg-bg3 ">
        <div className="min-w-min rounded-xl bg-n0 px-3 dark:bg-bg4">
          <table
            border={0}
            cellPadding={0}
            cellSpacing={0}
            style={{ borderSpacing: "0 12px" }}
            className="w-full border-separate whitespace-nowrap border-none p-0"
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
                {skeleton.map((e, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {!isLoading && !orders?.length && <AnyMatchingResults />}
      {!isLoading && orders?.length > 0 && (
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
      )} */}
    </Box>
  );
};

export default OrdersTable;

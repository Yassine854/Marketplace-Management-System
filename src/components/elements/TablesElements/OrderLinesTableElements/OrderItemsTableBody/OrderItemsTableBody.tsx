"use client";

import AnyMatchingResults from "../../AnyMatchingResults";
import { OrderLine } from "../../../../../types/orderLine";
import OrdersTableHead from "../OrderItemsTableHead";
import TableRow from "../OrderItemsTableRow";
import TableRowSkeleton from "../../TableRowSkeleton";
import { useEffect } from "react";

const OrdersTableBody = ({
  order,
  orders,
  isLoading,
  error,
  setSortOrder,
  setSortBy,
  selectAllOrders,
  unSelectAllOrders,
  selectOrder,
  unSelectOrder,
  onRowClick,
  actions,
}: any) => {
  return (
    <>
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className="w-full border-separate overflow-x-scroll whitespace-nowrap border-none pb-16 pt-8 "
      >
        <OrdersTableHead
          onSortClick={(sortBy: any, sortOrder: any) => {
            setSortBy(sortBy);
            setSortOrder(sortOrder);
          }}
          selectAllOrders={selectAllOrders}
          unSelectAllOrders={unSelectAllOrders}
        />

        <tbody>
          <>
            {!isLoading &&
              order?.lines?.map((line: OrderLine, i: number) => (
                <TableRow
                  actions={actions}
                  order={order}
                  line={line}
                  key={line.id}
                />
              ))}
          </>
          <>
            {isLoading &&
              [...Array(10)].map((_, i) => (
                <TableRowSkeleton key={i} number={6} />
              ))}
          </>
          <> {!isLoading && !orders?.length && <AnyMatchingResults />}</>
        </tbody>
      </table>
    </>
  );
};

export default OrdersTableBody;

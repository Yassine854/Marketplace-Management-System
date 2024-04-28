"use client";

import AnyMatchingResults from "../AnyMatchingResults";
import { Order } from "@/types/order";
import OrdersTableHead from "../OrdersTableHead";
import TableRow from "../TableRow";
import TableRowSkeleton from "../TableRowSkeleton";

const OrdersTableBody = ({
  orders,
  isLoading,
  error,
  setSortOrder,
  setSortBy,
  selectAllOrders,
  unSelectAllOrders,
  selectOrder,
  unSelectOrder,
}: any) => {
  return (
    <>
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className="w-full border-separate overflow-x-scroll whitespace-nowrap border-none pb-16 pt-2 "
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
              orders?.map((order: Order, i: number) => (
                <TableRow
                  order={order}
                  key={order.id}
                  onCheckClick={(isChecked: boolean) => {
                    if (isChecked) {
                      selectOrder(order.id);
                    } else {
                      unSelectOrder(order.id);
                    }
                  }}
                />
              ))}
          </>
          <>
            {isLoading &&
              [...Array(10)].map((_, i) => (
                <TableRowSkeleton key={i} number={8} />
              ))}
          </>
          <> {!isLoading && !orders?.length && <AnyMatchingResults />}</>
        </tbody>
      </table>
    </>
  );
};

export default OrdersTableBody;

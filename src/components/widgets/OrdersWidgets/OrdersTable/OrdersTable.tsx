import OrdersTableHead from "./OrdersTableHead";
import OrdersTableRow from "./OrdersTableRow";
import TableRowSkeleton from "./RowSkeleton";
import { defaultProps } from "./OrdersTable.defaultProps";

const { orders: defaultOrders } = defaultProps;

const OrdersTable = ({
  orders = defaultOrders,
  isLoading,
  onSort,
  changeSelectedSort,
}: any) => {
  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      className="relative w-full border-separate overflow-hidden whitespace-nowrap rounded-xl border-4  "
    >
      <OrdersTableHead changeSelectedSort={changeSelectedSort} />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(10)].map((_, i) => (
                <TableRowSkeleton key={i} number={10} />
              ))}
            </>
          ) : (
            <>
              {orders?.map((order: any) => (
                <OrdersTableRow key={order?.id} order={order} />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersTable;

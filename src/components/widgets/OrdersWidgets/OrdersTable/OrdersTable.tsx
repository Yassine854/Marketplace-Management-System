import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrdersTableRow from "./elements/OrdersTableRow";
import TableRowSkeleton from "./elements/RowSkeleton";
import { defaultProps } from "./OrdersTable.defaultProps";
const { orders: defaultOrders } = defaultProps;

const OrdersTable = ({
  orders = defaultOrders,
  isLoading,
  changeSelectedSort,
  onOrderClick,
}: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
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
                <OrdersTableRow
                  key={order?.id}
                  order={order}
                  onClick={onOrderClick}
                />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersTable;

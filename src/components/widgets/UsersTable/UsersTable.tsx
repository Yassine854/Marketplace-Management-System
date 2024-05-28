import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrdersTableRow from "./elements/OrdersTableRow";
import TableRowSkeleton from "./elements/RowSkeleton";
import { defaultProps } from "./UsersTable.defaultProps";
const { orders: defaultOrders } = defaultProps;

const OrdersTable = ({
  orders = defaultOrders,
  isLoading,
  changeSelectedSort,
  onOrderClick,
  onSelectAllClick,
  onSelectOrderClick,
  isAllOrdersSelected,
}: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <OrdersTableHead
        changeSelectedSort={changeSelectedSort}
        onSelectAllClick={onSelectAllClick}
        isAllOrdersSelected={isAllOrdersSelected}
      />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(25)].map((_, i) => (
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
                  onSelectOrderClick={onSelectOrderClick}
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

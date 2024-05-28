import TableRowSkeleton from "./elements/RowSkeleton";
import UsersTableHead from "./elements/UsersTableHead/UsersTableHead";
import UsersTableRow from "./elements/UsersTableRow";
import { defaultProps } from "./UsersTable.defaultProps";
const { orders: defaultOrders } = defaultProps;

const OrdersTable = ({
  users,
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
      <UsersTableHead
        changeSelectedSort={changeSelectedSort}
        onSelectAllClick={onSelectAllClick}
        isAllOrdersSelected={isAllOrdersSelected}
      />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(12)].map((_, i) => (
                <TableRowSkeleton key={i} number={7} />
              ))}
            </>
          ) : (
            <>
              {users?.map((user: any) => (
                <UsersTableRow key={user?.id} user={user} />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersTable;

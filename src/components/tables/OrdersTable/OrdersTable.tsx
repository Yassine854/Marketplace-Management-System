import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrdersTableRow from "./elements/OrdersTableRow";
import TableRowSkeleton from "./elements/RowSkeleton";

import {
  useOrdersData,
  useOrdersSelection,
  useOrdersSorting,
  useOrdersActions,
} from "@/hooks/ordersHooks";

const OrdersTable = () => {
  const { isAllOrdersSelected, onSelectAllClick, onSelectOrderClick } =
    useOrdersSelection();
  const { changeSelectedSort } = useOrdersSorting();
  const { orders, isLoading } = useOrdersData();
  const {
    onPDFIconClick,
    onOrderClick,
    onGeneratePickListClick,
    tableRowActions,
  } = useOrdersActions();

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
                <TableRowSkeleton key={i} number={9} />
              ))}
            </>
          ) : (
            <>
              {orders?.length > 0 &&
                orders?.map((order: any) => (
                  <OrdersTableRow
                    key={order?.id}
                    order={order}
                    onClick={onOrderClick(order.id)}
                    onSelectOrderClick={onSelectOrderClick}
                    onPDFIconClick={onPDFIconClick}
                    actionsList={tableRowActions}
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

import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrdersTableRow from "./elements/OrdersTableRow";
import TableRowSkeleton from "./elements/RowSkeleton";
import OrderCancelingModal from "../../widgets/OrderCancelingModal";
import { useOrdersTable } from "./useOrdersTable";

const OrdersTable = () => {
  const {
    onOrderClick,
    orderUnderActionId,
    isCancelingModalOpen,
    onOpenChange,
    cancelOrder,
    isCancelingPending,
    orderToCancelId,
    actions,
    generateSummary,
    pendingOrderId,
    orders,
    isLoading,
    isAllOrdersSelected,
    selectAllOrders,
    selectOrder,
    changeSelectedSort,
  } = useOrdersTable();

  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <OrdersTableHead
        changeSelectedSort={changeSelectedSort}
        onSelectAllClick={selectAllOrders}
        isAllOrdersSelected={isAllOrdersSelected}
      />

      <tbody>
        <>
          {isLoading && (
            <>
              {[...Array(25)].map((_, i) => (
                <TableRowSkeleton key={i} number={9} />
              ))}
            </>
          )}

          {!isLoading && (
            <>
              {orders?.length > 0 &&
                orders?.map((order: any) => (
                  <OrdersTableRow
                    key={order.id}
                    order={order}
                    onClick={() => {
                      onOrderClick(order.id);
                    }}
                    onSelectClick={selectOrder}
                    onPDFIconClick={generateSummary}
                    actionsList={actions}
                    isGenerateSummaryPending={pendingOrderId == order.id}
                    isSomeActionPending={orderUnderActionId == order.id}
                  />
                ))}
            </>
          )}
        </>
      </tbody>
      <OrderCancelingModal
        message={` Are you sure you want to cancel this order : ${orderToCancelId}? `}
        isOpen={isCancelingModalOpen}
        onConfirm={() => cancelOrder(orderToCancelId)}
        onOpenChange={onOpenChange}
        isPending={isCancelingPending}
      />
    </table>
  );
};

export default OrdersTable;

import { useOrdersTable } from "./useOrdersTable";
import TableRowSkeleton from "./elements/RowSkeleton";
import OrdersTableRow from "./elements/OrdersTableRow";
import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";

const OrdersTable = () => {
  const {
    orders,
    actions,
    isLoading,
    selectOrder,
    cancelOrder,
    onOpenChange,
    onOrderClick,
    pendingOrderId,
    orderToCancelId,
    generateSummary,
    selectAllOrders,
    changeSelectedSort,
    isCancelingPending,
    orderUnderActionId,
    isAllOrdersSelected,
    isCancelingModalOpen,
  } = useOrdersTable();

  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <OrdersTableHead
        onSelectAllClick={selectAllOrders}
        changeSelectedSort={changeSelectedSort}
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
                    order={order}
                    key={order.id}
                    actionsList={actions}
                    onSelectClick={selectOrder}
                    onPDFIconClick={generateSummary}
                    isSomeActionPending={orderUnderActionId == order.id}
                    isGenerateSummaryPending={pendingOrderId == order.id}
                    onClick={() => {
                      onOrderClick(order.id);
                    }}
                  />
                ))}
            </>
          )}
        </>
      </tbody>
      <OrderCancelingModal
        onOpenChange={onOpenChange}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onConfirm={() => cancelOrder(orderToCancelId)}
        message={` Are you sure you want to cancel this order : ${orderToCancelId}? `}
      />
    </table>
  );
};

export default OrdersTable;

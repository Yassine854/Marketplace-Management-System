import {
  useOrdersData,
  useOrdersSelection,
  useOrdersSorting,
  useOrderActions,
  useGenerateOrderSummary,
} from "@/hooks/ordersHooks";

import OrdersTableHead from "./elements/OrdersTableHead/OrdersTableHead";
import OrdersTableRow from "./elements/OrdersTableRow";
import TableRowSkeleton from "./elements/RowSkeleton";
import OrderCancelingModal from "./elements/OrderCancelingModal";

const OrdersTable = () => {
  const { changeSelectedSort } = useOrdersSorting();
  const { orders, isLoading } = useOrdersData();
  const { generateSummary, pendingOrderId } = useGenerateOrderSummary();
  const {
    onOrderClick,
    rowActions,
    orderUnderActionId,
    isCancelingModalOpen,
    onOpenChange,
    handleOrderCanceling,
    isCancelingPending,
    orderToCancelId,
  } = useOrderActions();

  const { isAllOrdersSelected, selectAllOrders, selectOrder } =
    useOrdersSelection();

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
                    actionsList={rowActions}
                    isGenerateSummaryPending={pendingOrderId == order.id}
                    isSomeActionPending={orderUnderActionId == order.id}
                  />
                ))}
            </>
          )}
        </>
      </tbody>
      <OrderCancelingModal
        isOpen={isCancelingModalOpen}
        orderId={orderToCancelId}
        cancelOrder={handleOrderCanceling}
        onOpenChange={onOpenChange}
        isPending={isCancelingPending}
      />
    </table>
  );
};

export default OrdersTable;

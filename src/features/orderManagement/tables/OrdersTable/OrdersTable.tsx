import { useOrdersTable } from "./useOrdersTable";
import TableRowSkeleton from "../../elements/RowSkeleton";
import OrdersTableRow from "../../elements/OrdersTableRow";
import { useOrderTableActions } from "./useOrderTableActions";
import OrdersTableHead from "../../elements/OrdersTableHead/OrdersTableHead";
import OrderCancelingModal from "@/features/orderManagement/widgets/OrderCancelingModal/OrderCancelingModal";

const OrdersTable = () => {
  const {
    orders,
    isLoading,
    selectOrder,
    selectAllOrders,
    changeSelectedSort,
    isAllOrdersSelected,
  } = useOrdersTable();

  const {
    actions,
    summary,
    onOrderClick,
    orderUnderActionId,
    isSomeActionPending,
    cancelOrder,
    isCancelingModalOpen,
    isCancelingPending,
    onCancelingModalClose,
  } = useOrderTableActions();

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
                    onPDFIconClick={() => summary.action(order.id)}
                    isSomeActionPending={
                      isSomeActionPending && orderUnderActionId === order.id
                    }
                    // isGenerateSummaryPending={}
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
        onConfirm={cancelOrder}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
        message=" Are you sure you want to cancel this orders ? "
      />
    </table>
  );
};

export default OrdersTable;

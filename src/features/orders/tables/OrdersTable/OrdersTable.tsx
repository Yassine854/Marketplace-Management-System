import { useOrdersTable } from "./useOrdersTable";
import TableRowSkeleton from "../../elements/RowSkeleton";
import OrdersTableRow from "../../elements/OrdersTableRow";
import { useOrderTableActions } from "./useOrderTableActions";
import OrdersTableHead from "../../elements/OrdersTableHead/OrdersTableHead";
import OrderCancelingModal from "@/features/orders/widgets/OrderCancelingModal/OrderCancelingModal";
import { logError } from "@/utils/logError";
import OrderInvoiceTemplate from "../../elements/OrderInvoiceTemplate";
import { pdf } from "@react-pdf/renderer";
import { axios } from "@/libs/axios";

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

  const handlePDFGeneration = async (orderId: string) => {
    try {
      const { data } = await axios.servicesClient(
        `/api/orders/getOrder?id=${orderId}`,
      );
      const blob = await pdf(
        <OrderInvoiceTemplate order={data?.order} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      logError(error);
    }
  };

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
                    onPDFIconClick={() => handlePDFGeneration(order.id)}
                    isSomeActionPending={
                      isSomeActionPending && orderUnderActionId === order.id
                    }
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
        message=" Are you sure you want to cancel this order? "
      />
    </table>
  );
};

export default OrdersTable;

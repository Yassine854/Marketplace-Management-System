import { useOrdersTable } from "./useOrdersTable";
import TableRowSkeleton from "../../elements/RowSkeleton";
import OrdersTableRow from "../../elements/OrdersTableRow";
import { useOrderTableActions } from "./useOrderTableActions";
import OrdersTableHead from "../../elements/OrdersTableHead/OrdersTableHead";
import OrderCancelingModal from "@/features/orders/widgets/OrderCancelingModal/OrderCancelingModal";
import { logError } from "@/utils/logError";
//import OrderInvoiceTemplate from "../../elements/OrderInvoiceTemplate";
//import { pdf } from "@react-pdf/renderer";
import { axios } from "@/libs/axios";
import { useOrderActionsFunctions } from "../../hooks/actions/useOrderActionsFunctions";
import { useOrderActionsStore } from "../../stores/orderActionsStore";

const handlePDFGeneration = async (orderId: string) => {
  try {
    // const { data } = await axios.servicesClient(
    //   `/api/orders/getOrder?id=${orderId}`,
    // );
    // const blob = await pdf(
    //   <OrderInvoiceTemplate order={data?.order} />,
    // ).toBlob();
    // const url = URL.createObjectURL(blob);
    //   return url;
  } catch (error) {
    logError(error);
  }
};

import { Order } from "@/types/order";
import { padding } from "@mui/system";

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const {
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

  const { setOrderUnderActionId, setIsSomeActionPending } =
    useOrderActionsStore();

  return (
    <div
      className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
      style={{ maxHeight: "600px" }}
    >
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ width: "100%" }}
      >
        <thead
          className="border-b border-gray-100 bg-gray-50 "
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            overflowX: "auto",
          }}
        >
          <OrdersTableHead
            onSelectAllClick={selectAllOrders}
            changeSelectedSort={changeSelectedSort}
            isAllOrdersSelected={isAllOrdersSelected}
          />
        </thead>

        <tbody
          className="divide-y divide-gray-200"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
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
                      onPDFIconClick={() => {
                        summary.action(order.id);
                      }}
                      // onPDFIconClick2={async () => {
                      //   setOrderUnderActionId(order.id);
                      //   setIsSomeActionPending(true);
                      //   //  const url = await handlePDFGeneration(order.id);
                      //   //      window.open(url, "_blank");
                      //   setIsSomeActionPending(false);
                      //   setOrderUnderActionId(undefined);
                      // }}
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
    </div>
  );
};

export default OrdersTable;

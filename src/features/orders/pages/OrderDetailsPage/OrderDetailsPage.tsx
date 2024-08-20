import OrderInfo from "../../widgets/OrderInfo/OrderInfo";
import CustomerInfo from "../../widgets/CustomerInfo/CustomerInfo";
import DeliveryInfo from "../../widgets/DeliveryInfo/DeliveryInfo";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import OrderItemsTable from "@/features/orders/tables/OrderItemsTable";
import OrderActions from "../../widgets/OrderDetailsActions/OrderDetailsActions";
import OrderDetailsPageHeader from "../../widgets/OrderDetailsPageHeader/OrderDetailsPageHeader";
import { useOrderDetailsPage } from "@/features/orders/pages/OrderDetailsPage/useOrderDetailsPage";
import OrderCancelingModal from "@/features/orders/widgets/OrderCancelingModal/OrderCancelingModal";

const OrderDetailsPage = () => {
  const {
    order,
    total,
    dropRef,
    actions,
    isLoading,
    cancelOrder,
    onArrowClick,
    isInEditMode,
    isCancelingPending,
    orderOnReviewItems,
    isSomeActionPending,
    onDeliveryDateChange,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useOrderDetailsPage();

  return (
    <div className="mt-[4.8rem] flex flex-grow flex-col justify-between bg-n20 p-4 ">
      <div className=" flex flex-grow flex-col overflow-hidden  rounded-2xl  bg-n10 p-2 shadow-2xl ">
        <>
          {!isLoading && (
            <OrderDetailsPageHeader
              status={order?.status}
              onArrowClick={onArrowClick}
            />
          )}
          {isLoading && <div className="h-12 w-full animate-pulse bg-n40" />}
        </>

        <Divider />
        <>
          {!isLoading && (
            <>
              <div className=" mt-8  flex justify-between px-4">
                <OrderInfo
                  id={order?.incrementId}
                  status={order?.status}
                  storeId={order?.storeId}
                  total={total?.toFixed(2)}
                  createdAt={order?.createdAt}
                />
                <CustomerInfo
                  phone={order?.customerPhone}
                  lastname={order?.customerLastname}
                  firstname={order?.customerFirstname}
                />

                <DeliveryInfo
                  isInEditMode={isInEditMode}
                  deliveryDate={order?.deliveryDate}
                  deliveryAgentName={order?.deliveryAgentName}
                  onDeliveryDateChange={onDeliveryDateChange}
                />

                <OrderActions
                  dropRef={dropRef}
                  actions={actions}
                  orderId={order?.id}
                  isInEditMode={isInEditMode}
                  isPending={isSomeActionPending}
                />
              </div>
            </>
          )}
          {isLoading && <div className="h-48 w-full animate-pulse bg-n40" />}
        </>
        <Divider />
        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll ">
          {!isLoading && orderOnReviewItems && (
            <OrderItemsTable
              items={orderOnReviewItems}
              isInEditMode={isInEditMode}
            />
          )}
          {isLoading && <div className="h-full w-full animate-pulse bg-n40" />}
        </div>
      </div>
      <OrderCancelingModal
        onConfirm={cancelOrder}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
        message=" Are you sure you want to cancel this order ? "
      />
    </div>
  );
};

export default OrderDetailsPage;

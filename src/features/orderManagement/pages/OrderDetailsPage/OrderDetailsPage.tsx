import OrderInfo from "../../widgets/OrderInfo/OrderInfo";
import CustomerInfo from "../../widgets/CustomerInfo/CustomerInfo";
import DeliveryInfo from "../../widgets/DeliveryInfo/DeliveryInfo";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import OrderItemsTable from "@/features/orderManagement/tables/OrderItemsTable";
import OrderActions from "../../widgets/OrderDetailsActions/OrderDetailsActions";
import { useOrderDetailsPage } from "@/features/orderManagement/pages/OrderDetailsPage/useOrderDetailsPage";
import OrderDetailsPageHeader from "../../widgets/OrderDetailsPageHeader/OrderDetailsPageHeader";
import OrderCancelingModal from "@/features/orderManagement/widgets/OrderCancelingModal/OrderCancelingModal";
import { useEffect } from "react";

const OrderDetailsPage = () => {
  const {
    order,
    total,
    dropRef,
    onArrowClick,
    isInEditMode,
    orderOnReviewItems,
    onDeliveryDateChange,
    actions,
    isSomeActionPending,
    cancelOrder,
    isCancelingModalOpen,
    onCancelingModalClose,
    isCancelingPending,
    isLoading,
  } = useOrderDetailsPage();

  return (
    <div className="mt-[4.8rem] flex flex-grow flex-col justify-between bg-n20 p-4 ">
      <div className=" flex flex-grow flex-col overflow-hidden  rounded-2xl  bg-n10 p-2 shadow-2xl ">
        <OrderDetailsPageHeader
          status={order?.status}
          onArrowClick={onArrowClick}
        />
        <Divider />

        <div className=" mt-8  flex justify-between px-12 ">
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
        <Divider />
        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll ">
          {!isLoading && orderOnReviewItems && (
            <OrderItemsTable
              items={orderOnReviewItems}
              isInEditMode={isInEditMode}
            />
          )}
        </div>
      </div>
      <OrderCancelingModal
        onConfirm={cancelOrder}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
        message=" Are you sure you want to cancel this orders ? "
      />
    </div>
  );
};

export default OrderDetailsPage;

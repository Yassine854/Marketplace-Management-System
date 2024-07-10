import OrderItemsTable from "@/components/tables/OrderItemsTable";
import CustomerInfo from "./CustomerInfo";
import Divider from "@/components/elements/SidebarElements/Divider";
import DeliveryInfo from "./DeliveryInfo";
import OrderInfo from "./OrderInfo";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";
import { useOrderDetailsPage } from "./useOrderDetailsPage";
import OrderActions from "./OrderActions";
import OrderDetailsPageHeader from "./OrderDetailsPageHeader";

const OrderDetailsPage = () => {
  const {
    order,
    total,
    orderUnderActionId,
    dropRef,
    orderOnReviewItems,
    cancelOrder,
    isCancelingModalOpen,
    onOpenChange,
    isCancelingPending,
    onDeliveryDateChange,
    actions,
    onArrowClick,
  } = useOrderDetailsPage();

  return (
    <div className="l mt-20 flex flex-grow flex-col justify-between bg-n20 p-4 ">
      <div className=" flex flex-grow flex-col overflow-hidden  rounded-2xl  bg-n10 p-2 text-8xl shadow-2xl ">
        <OrderDetailsPageHeader
          status={order?.status}
          onArrowClick={onArrowClick}
        />
        <Divider />

        <div className=" mt-8  flex justify-between px-12 ">
          <OrderInfo
            id={order?.id}
            status={order?.status}
            createdAt={order?.createdAt}
            total={total}
          />
          <CustomerInfo
            firstname={order?.customerFirstname}
            lastname={order?.customerLastname}
            phone={order?.customerPhone}
          />

          <DeliveryInfo
            deliveryAgent={order?.deliveryAgent}
            deliveryDate={order?.deliveryDate}
            onDeliveryDateChange={onDeliveryDateChange}
          />

          <OrderActions
            dropRef={dropRef}
            //@ts-ignore
            actions={actions[order?.status]}
            isPending={!!orderUnderActionId}
            orderId={order?.id}
          />
        </div>
        <Divider />
        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll ">
          <OrderItemsTable items={orderOnReviewItems} />
        </div>
      </div>
      <OrderCancelingModal
        onConfirm={cancelOrder}
        message={" Are you sure you want to cancel those orders ? "}
        isOpen={isCancelingModalOpen}
        onOpenChange={onOpenChange}
        isPending={isCancelingPending}
      />
    </div>
  );
};

export default OrderDetailsPage;

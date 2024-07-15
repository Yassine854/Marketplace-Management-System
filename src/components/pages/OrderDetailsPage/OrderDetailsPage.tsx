import OrderInfo from "./OrderInfo";
import CustomerInfo from "./CustomerInfo";
import DeliveryInfo from "./DeliveryInfo";
import OrderActions from "./OrderActions";
import { useOrderDetailsPage } from "./useOrderDetailsPage";
import OrderDetailsPageHeader from "./OrderDetailsPageHeader";
import OrderItemsTable from "@/components/tables/OrderItemsTable";
import Divider from "@/components/elements/SidebarElements/Divider";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";

const OrderDetailsPage = () => {
  const {
    order,
    total,
    dropRef,
    actions,
    cancelOrder,
    onOpenChange,
    onArrowClick,
    orderUnderActionId,
    orderOnReviewItems,
    isCancelingPending,
    onDeliveryDateChange,
    isCancelingModalOpen,
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
            deliveryDate={order?.deliveryDate}
            deliveryAgent={order?.deliveryAgent}
            onDeliveryDateChange={onDeliveryDateChange}
          />

          <OrderActions
            dropRef={dropRef}
            orderId={order?.id}
            //@ts-ignore
            actions={actions[order?.status]}
            isPending={!!orderUnderActionId}
          />
        </div>
        <Divider />
        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll ">
          <OrderItemsTable items={orderOnReviewItems} />
        </div>
      </div>
      <OrderCancelingModal
        onOpenChange={onOpenChange}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onConfirm={() => cancelOrder(order?.id)}
        message={" Are you sure you want to cancel this orders ? "}
      />
    </div>
  );
};

export default OrderDetailsPage;

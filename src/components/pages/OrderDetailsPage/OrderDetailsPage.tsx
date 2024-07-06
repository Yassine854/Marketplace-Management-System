import { useEffect } from "react";
import { redirect } from "next/navigation";
import OrderItemsTable from "@/components/tables/OrderItemsTable";
import { useGetOrder } from "@/hooks/ordersHooks/useGetOrder";
import { useOrdersStore } from "@/stores/ordersStore";
import CustomerInfo from "./CustomerInfo";
import Divider from "@/components/elements/SidebarElements/Divider";
import DeliveryInfo from "./DeliveryInfo";
import OrderInfo from "./OrderInfo";
import ActionsDropdown from "@/components/widgets/ActionsDropdown";
import { useOrderActions } from "@/hooks/ordersHooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { Chip } from "@nextui-org/react";
import OrderCancelingModal from "@/components/widgets/OrderCancelingModal";
import { IconBrightnessAuto } from "@tabler/icons-react";

const OrderDetailsPage = () => {
  const { orderOnReviewId } = useOrdersStore();
  const { data: order, refetch } = useGetOrder(orderOnReviewId);

  const {
    editOrderActions: actions,
    orderUnderActionId,
    cancelOrder,
    isCancelingModalOpen,
    onOpenChange,
    isCancelingPending,
    dropRef,
    // onClose,
  } = useOrderActions();

  useEffect(() => {
    !orderUnderActionId && refetch();
  }, [orderUnderActionId, refetch()]);

  useEffect(() => {
    if (!orderOnReviewId) {
      redirect("/orders");
    }
  }, [orderOnReviewId, order]);

  return (
    <div className="l mt-20 flex flex-grow flex-col justify-between bg-n20 p-4 ">
      <div className=" flex flex-grow flex-col overflow-hidden  rounded-2xl  bg-n10 p-2 text-8xl shadow-2xl">
        <div className="mb-2 flex  w-full items-center justify-between px-4 ">
          <div className=" flex cursor-pointer ">
            <IconArrowLeft stroke={4} size={32} />
          </div>
          <div className=" flex h-12 items-center justify-center ">
            <p className="mr-4 text-2xl font-bold text-black">Status : </p>
            <Chip color="success" size="lg">
              <p className="text-xl font-semibold">{order?.status}</p>
            </Chip>
          </div>
        </div>
        <Divider />

        <div className="mb-2 mt-2 flex  justify-between px-12">
          <OrderInfo
            id={order?.id}
            status={order?.status}
            createdAt={order?.createdAt}
            total={order?.total}
          />
          <CustomerInfo
            firstname={order?.customerFirstname}
            lastname={order?.customerLastname}
            phone="26675997"
          />

          <DeliveryInfo
            deliveryAgent={order?.deliveryAgent}
            deliveryDate={order?.deliveryDate}
          />
          <div className="flex">
            <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
              <IconBrightnessAuto stroke={2} size={48} />
            </div>

            <div className=" ml-2">
              <p className=" ml-2 pb-2 text-2xl font-bold text-black">
                Actions{" "}
              </p>
              <ActionsDropdown
                dropRef={dropRef}
                //@ts-ignore
                actions={actions[order?.status]}
                isPending={!!orderUnderActionId}
                orderId={order?.id}
              />
            </div>
          </div>
        </div>
        <Divider />
        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll">
          <OrderItemsTable items={order?.lines} />
        </div>
      </div>
      <OrderCancelingModal
        onConfirm={cancelOrder}
        message={" Are you sure you want to cancel those orders ? "}
        isOpen={isCancelingModalOpen}
        onOpenChange={onOpenChange}
        isPending={isCancelingPending}
        //   onClose={onClose}
      />
    </div>
  );
};

export default OrderDetailsPage;

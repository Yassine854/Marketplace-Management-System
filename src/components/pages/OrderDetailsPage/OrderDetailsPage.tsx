import { useEffect } from "react";
import { redirect } from "next/navigation";
import OrderItemsTable from "@/components/tables/OrderItemsTable";
import { useGetOrder } from "@/hooks/ordersHooks/useGetOrder";
import { useOrdersStore } from "@/stores/ordersStore";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";
import { IconUser, IconShoppingCart } from "@tabler/icons-react";
import Divider from "@/components/elements/SidebarElements/Divider";
import Loading from "@/components/elements/Loading";
import Dropdown from "@/components/inputs/Dropdown";
import { Button } from "@nextui-org/react";

const OrderInfo = ({ id, status, createdAt, deliveryDate }: any) => {
  return (
    <div className=" ml-12 flex h-32">
      <div className="">
        <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
          <IconShoppingCart stroke={2} size={48} />
        </div>
      </div>

      <div className="ml-4  flex h-full w-full flex-grow flex-col  ">
        <p className=" pb-2 text-2xl font-bold text-black">Order Info</p>
        <p className="text-black  ">
          <span className="text-n90 ">ID : </span>#{id}
        </p>
        <p className="text-black  ">
          <span className="text-n90 ">Status:</span>
          {status}
        </p>
        <p className="text-black  ">
          <span className="text-n90 ">Created At :</span>
          {unixTimestampToDate(createdAt)}
        </p>
        <p className="text-black  ">
          <span className="text-n90 ">Delivery Date :</span>
          {unixTimestampToDate(deliveryDate)}
        </p>
      </div>
    </div>
  );
};

const CustomerInfo = ({ customerFirstname, customerLastname, phone }: any) => {
  return (
    <div className=" flex h-32 ">
      <div className="">
        <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
          <IconUser stroke={2} size={48} />
        </div>
      </div>

      <div className="ml-4  flex h-full w-full flex-grow flex-col  ">
        <p className=" pb-2 text-2xl font-bold text-black">Customer</p>
        <p className="text-black  ">
          <span className="text-n90 ">Name :</span>
          {customerFirstname} {customerLastname}{" "}
        </p>
        <p className="text-black  ">
          <span className="text-n90 ">Phone :</span>
          {phone}
        </p>
      </div>
    </div>
  );
};

const OrderDetailsPage = () => {
  const { orderOnReviewId } = useOrdersStore();
  const { data: order } = useGetOrder(orderOnReviewId);
  const isSomeOrdersSelected = true;
  const selectedAction = true;
  const actions: any[] = [];
  const isPending = false;

  const setSelectedAction = () => {};
  const selectedStatus = "";

  useEffect(() => {
    console.log("🚀 ~ OrderDetailsPage ~ order:", order);
    console.log("🚀 ~ OrderDetailsPage ~ orderOnReviewId:", orderOnReviewId);

    if (!orderOnReviewId) {
      redirect("/orders");
    }
  }, [orderOnReviewId, order]);

  return (
    <div className="l mt-20 flex flex-grow flex-col justify-between bg-n20 p-4 ">
      <div className=" flex flex-grow flex-col overflow-hidden  rounded-2xl  bg-n10 p-4 text-8xl shadow-2xl">
        <div className="mb-2 flex h-12 w-full justify-between ">
          <p className=" text-2xl font-semibold text-black">Order Details </p>
          <button
            className="btn m-2 flex h-2 items-center  justify-center p-4"
            onClick={() => {
              const selected = actions.find(
                (action: any) => action.key === selectedAction,
              );
              selected.action();
            }}
          >
            Confirm
          </button>
        </div>
        <Divider />

        <div className="mb-8 mt-2 flex h-24">
          <CustomerInfo
            firstname={order?.customerFirstname}
            lastname={order?.customerLastname}
            phone="26675997"
          />
          <OrderInfo
            id={order?.id}
            status={order?.status}
            createdAt={order?.createdAt}
            deliveryDate={order?.deliveryDate}
          />
        </div>
        <Divider />
        <div className=" m-2 flex w-full items-center justify-between">
          <p className="text-2xl font-bold text-black">Order Items : </p>
          <button
            className="btn flex h-2  items-center  justify-center px-8 py-4"
            onClick={() => {
              const selected = actions.find(
                (action: any) => action.key === selectedAction,
              );
              selected.action();
            }}
          >
            Edit
          </button>
        </div>

        <div className="relative mb-4 mt-1 flex flex-grow overflow-y-scroll">
          <OrderItemsTable items={order?.lines} />
        </div>
        <div className="flex h-28  w-full items-center justify-end  px-12 text-sm">
          <Button color="danger" variant="solid" onPress={() => {}}>
            <p className="font-semibold">Cancel</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

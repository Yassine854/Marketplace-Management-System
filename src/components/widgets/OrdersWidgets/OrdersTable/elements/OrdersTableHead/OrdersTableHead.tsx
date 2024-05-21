import Checkbox from "@/components/elements/sharedElements/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import OrdersTableHeadCell from "../OrdersTableHeadCell";
import OrdersTableHeadSmallCell from "../OrdersTableHeadSmallCell";
import { useOrdersTableHead } from "./useOrdersTableHead";

const OrdersTableHead = ({ changeSelectedSort }: any) => {
  const { onCustomerClick, onDeliveryDateClick, onTotalClick } =
    useOrdersTableHead(changeSelectedSort);

  return (
    <thead className="sticky top-0 z-10">
      <tr className="  h-12  w-full bg-n40 font-semibold">
        <OrdersTableHeadSmallCell>
          <Checkbox />
        </OrdersTableHeadSmallCell>
        <OrdersTableHeadCell>ID</OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          Customer <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          Total(TND)
          <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onDeliveryDateClick}>
          Delivery Date <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell>Delivery Agent</OrdersTableHeadCell>
        <OrdersTableHeadCell>Delivery Status</OrdersTableHeadCell>
        <OrdersTableHeadSmallCell>Summary</OrdersTableHeadSmallCell>
        <OrdersTableHeadSmallCell>Actions</OrdersTableHeadSmallCell>
        <OrdersTableHeadSmallCell>Label</OrdersTableHeadSmallCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

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
        <OrdersTableHeadCell>Username</OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          Name <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          Email <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          Role <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          Status <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          Created_at <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>Edit</OrdersTableHeadCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

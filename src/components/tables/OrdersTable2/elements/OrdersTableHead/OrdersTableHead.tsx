import Checkbox from "@/components/inputs/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import OrdersTableHeadCell from "../OrdersTableHeadCell";
import OrdersTableHeadSmallCell from "../OrdersTableHeadSmallCell";
import { useOrdersTableHead } from "./useOrdersTableHead";

const OrdersTableHead = ({
  changeSelectedSort,
  onSelectAllClick,
  isAllOrdersSelected,
}: any) => {
  const { onCustomerClick, onDeliveryDateClick, onTotalClick } =
    useOrdersTableHead(changeSelectedSort);

  return (
    <thead className="sticky left-0 right-0 top-0 z-10 bg-n40 ">
      <tr>
        <OrdersTableHeadSmallCell>
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-l-xl bg-purple-400 ">
            <Checkbox
              onClick={onSelectAllClick}
              isChecked={isAllOrdersSelected}
            />
          </div>
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
        <OrdersTableHeadSmallCell>
          <div className="flex h-full w-full items-center justify-center  overflow-hidden rounded-r-xl bg-purple-400  ">
            Actions
          </div>
        </OrdersTableHeadSmallCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

import Checkbox from "@/features/shared/inputs/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import OrdersTableHeadCell from "../OrdersTableHeadCell";
import OrdersTableHeadSmallCell from "../OrdersTableHeadSmallCell";
import { useOrdersTableHead } from "@/features/orderManagement/hooks";

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
          <Checkbox
            onClick={onSelectAllClick}
            isChecked={isAllOrdersSelected}
          />
        </OrdersTableHeadSmallCell>
        <OrdersTableHeadCell>ID</OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          Customer <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          Total
          <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onDeliveryDateClick}>
          Delivery Date <IconSelector size={18} />
        </OrdersTableHeadCell>
        <OrdersTableHeadCell>Delivery Agent</OrdersTableHeadCell>
        <OrdersTableHeadCell>Delivery Status</OrdersTableHeadCell>
        <OrdersTableHeadSmallCell>Summary</OrdersTableHeadSmallCell>
        <OrdersTableHeadSmallCell>Actions</OrdersTableHeadSmallCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

import { IconSettings } from "@tabler/icons-react";
import OrdersTableCell from "./OrdersTableCell";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";

const OrdersTableRow = ({ order }: any) => {
  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      <OrdersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname}
        </p>
      </OrdersTableCell>
      <OrdersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname + " " + order?.customerLastname}
        </p>
      </OrdersTableCell>
      <OrdersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname + " " + order?.customerLastname}
        </p>
      </OrdersTableCell>
      <OrdersTableCell>
        <p className="truncate ">{order?.total}</p>
      </OrdersTableCell>
      <OrdersTableCell>
        {unixTimestampToDate(order?.deliveryDate)}
      </OrdersTableCell>
      <OrdersTableCell>
        <p className="truncate ">{order?.deliveryAgent || "***"}</p>
      </OrdersTableCell>
      <OrdersTableCell>
        <IconSettings string={2} />
      </OrdersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

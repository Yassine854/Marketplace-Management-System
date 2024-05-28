import { IconPdf, IconSettings, IconTruck } from "@tabler/icons-react";

import ActionsCell from "./ActionsCell";
import Checkbox from "@/components/elements/sharedElements/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";

const OrdersTableRow = ({
  onClick = () => console.log("Row clicked"),
  order,
  onSelectOrderClick,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
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
        <IconSettings />
      </OrdersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

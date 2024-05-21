import { IconPdf, IconTruck } from "@tabler/icons-react";

import ActionsCell from "./ActionsCell";
import Checkbox from "@/components/elements/sharedElements/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";

const actions = [
  {
    name: "Edit",
    key: "edit",
    action: (id: any) => {},
  },
  {
    name: "Generate Pick List",
    key: "picklist",
    action: () => {},
  },
  { name: "Print BL's", key: "bl", action: () => {} },
  {
    name: "Manage Milk-Runs",
    key: "mr",
    action: () => {},
  },
];
const OrdersTableRow = ({
  onClick = () => console.log("Row clicked"),
  order,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      <OrdersTableCell>
        <Checkbox />
      </OrdersTableCell>
      <OrdersTableCell>{order?.kamiounId}</OrdersTableCell>
      <OrdersTableCell>
        <p className=" truncate text-ellipsis">
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
        <p className="truncate ">{order?.deliveryStatus || "***"}</p>
      </OrdersTableCell>
      <OrdersTableCell>
        <div
          className="rounded-full p-2 hover:bg-n10"
          onClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          <IconPdf />
        </div>
      </OrdersTableCell>
      <ActionsCell />
      <OrdersTableCell>
        <IconTruck color="red" />
      </OrdersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

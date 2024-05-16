import { IconPdf, IconTruck } from "@tabler/icons-react";

import Checkbox from "@/components/elements/sharedElements/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import TableActions from "@/components/elements/TablesElements/OpenOrdersTableElements/TableActions";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";

const actions = [
  {
    name: "Edit",
    key: "edit",
    action: (id: any) => {
      //  push("/order/" + id);
    },
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
    action: () => {
      //push("/milk-run");
    },
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
        <Checkbox key="checkbox" />
      </OrdersTableCell>
      <OrdersTableCell>{order?.kamiounId}</OrdersTableCell>
      <OrdersTableCell>
        {order?.customerFirstname + " " + order?.customerLastname}
      </OrdersTableCell>
      <OrdersTableCell>{order?.total}</OrdersTableCell>
      <OrdersTableCell>
        {unixTimestampToDate(order?.deliveryDate)}
      </OrdersTableCell>
      <OrdersTableCell>{order?.deliveryAgent || "***"}</OrdersTableCell>
      <OrdersTableCell>{order?.deliveryStatus || "***"}</OrdersTableCell>
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
      <OrdersTableCell>
        <IconTruck color="red" />
      </OrdersTableCell>
      <OrdersTableCell>
        <TableActions actions={actions} orderId={order.id} />
      </OrdersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

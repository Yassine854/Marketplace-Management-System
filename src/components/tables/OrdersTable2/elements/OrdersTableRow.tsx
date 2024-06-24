import { IconPdf, IconTruck } from "@tabler/icons-react";

import ActionsCell from "./ActionsCell";
import Checkbox from "@/components/inputs/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";
import TableActions from "@/components/elements/TablesElements/TableActions";

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
  onSelectOrderClick,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      <OrdersTableCell>
        <Checkbox
          isChecked={order.isSelected}
          onClick={(isChecked) => {
            onSelectOrderClick(isChecked, order.id);
          }}
        />
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
      <OrdersTableCell>
        <TableActions actions={actions} orderId={order.id} />
      </OrdersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

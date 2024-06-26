import { IconPdf, IconTruck } from "@tabler/icons-react";
import Checkbox from "@/components/inputs/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";
import TableActions from "@/components/elements/TablesElements/TableActions";

const OrdersTableRow = ({
  onClick = () => console.log("Row clicked"),
  order,
  onSelectOrderClick,
  onPDFIconClick,
  actionsList,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n60 dark:even:bg-bg3"
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
      <OrdersTableCell>
        <div className="flex h-full w-full pl-6">
          <IconTruck color="green" />-{order?.kamiounId}
        </div>
      </OrdersTableCell>
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
            onPDFIconClick(order.id);
          }}
        >
          <IconPdf />
        </div>
      </OrdersTableCell>
      <td className="px-3 py-4">
        <div className=" flex justify-center">
          <TableActions orderId={order.id} actionsList={actionsList} />
        </div>
      </td>
    </tr>
  );
};

export default OrdersTableRow;

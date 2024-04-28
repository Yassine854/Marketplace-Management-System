import { IconPdf, IconTruck } from "@tabler/icons-react";

import CheckboxCustom from "@/components/elements/TablesElements/Checkbox";
import { Props } from "./TableRow.types";
import TableActions from "@/components/elements/TablesElements/TableActions";
import { defaultProps } from "./TableRow.defaultProps";
import { useEffect } from "react";

const RowItem = ({ content }: any) => (
  <td>
    <div className=" flex h-20 items-center  justify-center  ">{content}</div>
  </td>
);

const TableRow = ({ order, onClick, onCheckClick }: any) => {
  useEffect(() => {
    console.log("🚀 ~ TableRow ~ order:", order.isSelected);
  }, [order]);
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={() => {
        //onClick(order.id);
      }}
    >
      <RowItem
        content={
          <CheckboxCustom isChecked={order.isSelected} onClick={onCheckClick} />
        }
      />

      <RowItem content={order.id} />

      <RowItem content={order.customer.name} />

      <RowItem content={order.total} />

      <RowItem content={order.deliveryDate} />

      <RowItem
        content={
          <div className="rounded-full p-2 hover:bg-n10">
            <IconPdf />
          </div>
        }
      />

      <RowItem content={<IconTruck color="red" />} />
      <RowItem content={<TableActions />} />
    </tr>
  );
};
export default TableRow;

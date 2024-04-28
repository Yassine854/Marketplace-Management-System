import { IconPdf, IconTruck } from "@tabler/icons-react";

import CheckboxCustom from "@/components/elements/TablesElements/Checkbox";
import TableActions from "@/components/elements/TablesElements/TableActions";

const RowItem = ({ content }: any) => (
  <td>
    <div className=" flex h-20 items-center  justify-center  ">{content}</div>
  </td>
);

const TableRow = ({ order, onClick, onCheckClick, actions }: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
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
          <div
            className="rounded-full p-2 hover:bg-n10"
            onClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <IconPdf />
          </div>
        }
      />

      <RowItem content={<IconTruck color="red" />} />
      <RowItem
        content={<TableActions actions={actions} orderId={order.id} />}
      />
    </tr>
  );
};
export default TableRow;

import CheckboxCustom from "@/components/elements/TablesElements/Checkbox";
import { Props } from "./TableRow.types";
import TableActions from "@/components/elements/TablesElements/TableActions";
import { defaultProps } from "./TableRow.defaultProps";

const TableRow = ({
  order = defaultProps.order,
  onClick = defaultProps.onClick, //key,
}: Props) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={() => {
        onClick(order.id);
      }}
    >
      <td className="flex justify-center px-3 py-2">
        <CheckboxCustom />
      </td>

      <td className="px-3 py-2">
        <div className="flex justify-center">{order.id}</div>
      </td>
      <td className="px-3 py-2">
        <div className="flex justify-center">{order.customer.name}</div>
      </td>
      <td className="px-3 py-2">
        <div className="flex justify-center">{order.total}</div>
      </td>
      <td className="px-3 py-2">
        <div className="flex justify-center">{order.deliveryDate}</div>
      </td>

      <td className="px-3 py-2">
        <div className="flex h-full items-center justify-center">
          <div className="flex justify-center">
            <TableActions />
          </div>
        </div>
      </td>
    </tr>
  );
};
export default TableRow;

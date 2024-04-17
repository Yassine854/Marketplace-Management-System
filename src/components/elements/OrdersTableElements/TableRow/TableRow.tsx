import CheckboxCustom from "@/components/elements/OrdersTableElements/Checkbox";
import { Props } from "./TableRow.types";
import TableActions from "@/components/elements/OrdersTableElements/TableActions";
import { defaultProps } from "./TableRow.defaultProps";

const TableRow = ({ id, customer, total, deliveryDate, onClick }: Props) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={() => {
        onClick(id);
      }}
    >
      <td className="px-3 py-2">
        <CheckboxCustom />
      </td>

      <td className="px-3 py-2">{id}</td>
      <td className="px-3 py-2">{customer}</td>
      <td className="px-3 py-2">{total}</td>
      <td className="px-3 py-2">{deliveryDate}</td>

      <td className="px-3 py-2">
        <div className="flex h-full items-center justify-center">
          <TableActions
          // fromBottom={
          //   // index == numberOfItems - 1 || index == numberOfItems - 2
          // }
          />
        </div>
      </td>
    </tr>
  );
};
TableRow.defaultProps = defaultProps;
export default TableRow;

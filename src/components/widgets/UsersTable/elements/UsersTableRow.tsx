import { IconSettings } from "@tabler/icons-react";
import UsersTableCell from "./UsersTableCell";

const OrdersTableRow = ({ order }: any) => {
  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname}
        </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname + " " + order?.customerLastname}
        </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {order?.customerFirstname + " " + order?.customerLastname}
        </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{order?.total}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{order?.deliveryAgent || "***"}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{order?.deliveryAgent || "***"}</p>
      </UsersTableCell>
      <UsersTableCell>
        <IconSettings string={2} />
      </UsersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

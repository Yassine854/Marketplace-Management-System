import { IconSettings } from "@tabler/icons-react";
import UsersTableCell from "./UsersTableCell";

const OrdersTableRow = ({ user }: any) => {
  console.log("🚀 ~ OrdersTableRow ~ user:", user);

  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.id}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.id} </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.id} </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{user.id}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{user.id}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{user.id}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{user.id}</p>
      </UsersTableCell>
      <UsersTableCell>
        <IconSettings string={2} className="cursor-pointer" />
      </UsersTableCell>
    </tr>
  );
};
export default OrdersTableRow;

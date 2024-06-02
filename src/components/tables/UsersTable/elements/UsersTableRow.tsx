import { IconSettings } from "@tabler/icons-react";
import UsersTableCell from "./UsersTableCell";

const UsersTableRow = ({ user }: any) => {
  let status = "New";
  //const warehouses = ["mghira", "sousse", "shargasfasdfia", "ariana", "all"];
  const warehouses = ["all"];
  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.username}</p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.username} </p>
      </UsersTableCell>
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.username} </p>
      </UsersTableCell>
      <UsersTableCell>
        <span
          key={1}
          className="text-secondary m-2 block w-16 overflow-hidden text-ellipsis rounded-xl border border-n30 bg-secondary1/10 p-1 py-2 text-center text-xs font-bold dark:border-n500 dark:bg-bg3 "
        >
          Admin
        </span>
      </UsersTableCell>
      <UsersTableCell>
        <div className="flex max-w-36 flex-grow flex-wrap items-center justify-center">
          {warehouses.map((warehouse: any) => (
            <span
              key={1}
              className="text-secondary m-2 block w-16 overflow-hidden text-ellipsis rounded-xl border border-n30 bg-secondary1/10 p-1 py-2 text-center text-xs font-bold dark:border-n500 dark:bg-bg3 "
            >
              {warehouse}
            </span>
          ))}
        </div>
      </UsersTableCell>
      <UsersTableCell>
        <span
          className={`block w-28 rounded-xl border border-n30 py-2 text-center text-xs font-bold dark:border-n500 xxl:w-36 ${
            status == "New" && "bg-primary/10 text-primary dark:bg-bg3"
          } ${
            status == "Available" &&
            "bg-secondary1/10 text-secondary1 dark:bg-bg3"
          } ${
            status == "Busy" && "bg-secondary2/10 text-secondary2 dark:bg-bg3"
          } `}
        >
          {status}
        </span>
      </UsersTableCell>
      <UsersTableCell>
        <p className="truncate ">{user.username}</p>
      </UsersTableCell>
      <UsersTableCell>
        <IconSettings string={2} className="cursor-pointer" />
      </UsersTableCell>
    </tr>
  );
};
export default UsersTableRow;

import { IconSettings } from "@tabler/icons-react";
import UsersTableCell from "./UsersTableCell";
import { unixTimestampToDateDMY } from "@/utils/unixTimestamp";

const UsersTableRow = ({ user }: any) => {
  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      {/* Username */}
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.username}</p>
      </UsersTableCell>
      {/* Name */}
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {user.firstName + " " + user.lastName}{" "}
        </p>
      </UsersTableCell>
      {/* Email */}
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">
          {user.email || "*****"}{" "}
        </p>
      </UsersTableCell>
      {/* Role */}
      <UsersTableCell>
        <span
          key={1}
          className="m-2 block w-16 overflow-hidden text-ellipsis rounded-xl border border-n30 bg-secondary1/10 p-1 py-2 text-center text-xs font-bold text-secondary dark:border-n500 dark:bg-bg3 "
        >
          {user.roleCode}
        </span>
      </UsersTableCell>
      {/* Warehouse */}
      <UsersTableCell>
        <div className="flex max-w-36 flex-grow flex-wrap items-center justify-center">
          <span
            key={1}
            className="m-2 block w-16 overflow-hidden text-ellipsis rounded-xl border border-n30 bg-secondary1/10 p-1 py-2 text-center text-xs font-bold text-secondary dark:border-n500 dark:bg-bg3 "
          >
            {user.warehouseCode}
          </span>
        </div>
      </UsersTableCell>
      {/* Status */}
      <UsersTableCell>
        <span
          className={`block w-28 rounded-xl border border-n30 py-2 text-center text-xs font-bold dark:border-n500 xxl:w-36 ${
            user.status == "New" && "bg-primary/10 text-primary dark:bg-bg3"
          } ${
            user.status == "Available" &&
            "bg-secondary1/10 text-secondary1 dark:bg-bg3"
          } ${
            user.status == "Busy" &&
            "bg-secondary2/10 text-secondary2 dark:bg-bg3"
          } `}
        >
          {user.status}
        </span>
      </UsersTableCell>
      {/* Created At */}
      <UsersTableCell>
        <p className="truncate ">
          {unixTimestampToDateDMY(Number(user.createdAt))}
        </p>
      </UsersTableCell>
      {/* Edit */}
      <UsersTableCell>
        <IconSettings string={2} className="cursor-pointer" />
      </UsersTableCell>
    </tr>
  );
};

export default UsersTableRow;

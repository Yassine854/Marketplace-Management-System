import TableCell from "./TableCell";

const TableRow = ({ username, action, orderId, time }: any) => {
  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      {/* Username */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{username}</p>
      </TableCell>
      {/* Action */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{action}</p>
      </TableCell>
      {/* Order Id */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{orderId}</p>
      </TableCell>
      {/* Time */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{time}</p>
      </TableCell>
    </tr>
  );
};

export default TableRow;

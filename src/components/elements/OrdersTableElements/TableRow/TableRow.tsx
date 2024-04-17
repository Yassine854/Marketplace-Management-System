"use client";

import CheckboxCustom from "@/components/elements/OrdersTableElements/Checkbox";
import Image from "next/image";
import { Props } from "./TableRow.types";
import TableActions from "@/components/elements/OrdersTableElements/TableActions";
import { defaultProps } from "./TableRow.defaultProps";
//import { timeAgo } from "@/utils/timeAgo";

const TableRow = ({
  type,
  size,
  version,
  numberOfItems,
  icon,
  time,
  img,
  index,
  name,
}: any) => {
  return (
    <tr className="even:bg-primary/5 dark:even:bg-bg3">
      <td className="px-3 py-2">
        <CheckboxCustom />
      </td>
      <td className="px-3 py-1">
        <div className="flex items-center gap-3">
          <Image
            width={32}
            height={32}
            className="shrink-0 rounded-full"
            src={icon}
            alt="img"
          />
          <span className="inline-block font-medium">{type}</span>
        </div>
      </td>
      <td className="px-3 py-2">{size}</td>
      <td className="px-3 py-2">{version}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src={img}
            alt="img"
          />
          <div className="flex flex-col">
            <span className="mb-1 inline-block font-medium">{name}</span>
            {/* <span className="text-xs">{timeAgo(time)}</span> */}
            <span className="text-xs">3h</span>
          </div>
        </div>
      </td>

      <td className="px-3 py-2">
        <div className="flex h-full items-center justify-center">
          <TableActions
            fromBottom={
              index == numberOfItems - 1 || index == numberOfItems - 2
            }
          />
        </div>
      </td>
    </tr>
  );
};
TableRow.defaultProps = defaultProps;
export default TableRow;

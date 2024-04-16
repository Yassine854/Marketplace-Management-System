"use client";

import CheckboxCustom from "@/components/elements/Checkbox";
import Image from "next/image";
import { Props } from "./TableRow.types";
import TableActions from "@/components/elements/TableActions";
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
      <td className="py-2 px-3">
        <CheckboxCustom />
      </td>
      <td className="py-1 px-3">
        <div className="flex items-center gap-3">
          <Image
            width={32}
            height={32}
            className="rounded-full shrink-0"
            src={icon}
            alt="img"
          />
          <span className="font-medium inline-block">{type}</span>
        </div>
      </td>
      <td className="py-2 px-3">{size}</td>
      <td className="py-2 px-3">{version}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-3">
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src={img}
            alt="img"
          />
          <div className="flex flex-col">
            <span className="font-medium inline-block mb-1">{name}</span>
            {/* <span className="text-xs">{timeAgo(time)}</span> */}
            <span className="text-xs">3h</span>
          </div>
        </div>
      </td>

      <td className="py-2 px-3">
        <div className="flex justify-center items-center h-full">
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

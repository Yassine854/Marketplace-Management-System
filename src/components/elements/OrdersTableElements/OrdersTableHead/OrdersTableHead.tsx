"use client";

import Checkbox from "../Checkbox";
import { IconSelector } from "@tabler/icons-react";

const rows = [
  { name: "ID", isSortable: false },
  { name: "Customer", isSortable: true },
  { name: "Total", isSortable: true },
  { name: "Delivery Date", isSortable: true },
  { name: "Actions", isSortable: false },
];

const OrdersTableHead = ({ onSortClick }: any) => {
  return (
    <thead className="">
      <tr className=" font-semibold ">
        <td className="w-14">
          <div className="flex cursor-pointer select-none items-center justify-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
            <Checkbox isChecked={false} />
          </div>
        </td>

        {rows.map((item, index) => (
          <td
            key={index}
            onClick={() => {
              item.isSortable && onSortClick("type");
            }}
            className="w-14"
          >
            <div className="flex cursor-pointer select-none items-center justify-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
              {item.name} {item.isSortable && <IconSelector size={18} />}
            </div>
          </td>
        ))}
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

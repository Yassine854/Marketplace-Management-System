"use client";

import Checkbox from "../Checkbox";
import { IconSelector } from "@tabler/icons-react";

const rows = [
  { name: "ID", isSortable: false },
  { name: "Customer", isSortable: false },
  { name: "Total", isSortable: true },
  { name: "Delivery Date", isSortable: true },
  { name: "Actions", isSortable: false },
];

const OrdersTableHead = ({ onSortClick }: any) => {
  return (
    <thead>
      <tr className="bg-primary/5 font-semibold dark:bg-bg3">
        <td className="p-5">
          <Checkbox isChecked={false} />
        </td>

        {rows.map((item, index) => (
          <td
            key={index}
            onClick={() => {
              item.isSortable && onSortClick("type");
            }}
            className="p-5"
          >
            <div className="flex cursor-pointer select-none items-center gap-1">
              {item.name} {item.isSortable && <IconSelector size={18} />}
            </div>
          </td>
        ))}
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

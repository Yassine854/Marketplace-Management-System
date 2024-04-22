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
{
  /* <thead>
              <tr className="font-semibold">
                <td onClick={() => sortData("id")} className="w-14">
                  <div className="flex cursor-pointer select-none items-center gap-1 rounded-s-xl bg-primary/5 px-3 py-5 pl-6 dark:bg-bg3">
                    Serial No <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("name")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    User <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("country")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Location <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("industry")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Industry <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("status")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Status <IconSelector size={18} />
                  </div>
                </td>
                <td>
                  <div className="bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Relations
                  </div>
                </td>
                <td>
                  <div className="rounded-e-xl bg-primary/5 px-3 py-5 text-center dark:bg-bg3">
                    Action
                  </div>
                </td>
              </tr>
            </thead> */
}

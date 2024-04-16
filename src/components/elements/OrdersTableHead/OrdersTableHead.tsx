"use client";

import { IconSelector } from "@tabler/icons-react";

const OrdersTableHead = ({ sortData }: any) => {
  return (
    <thead>
      <tr className="bg-primary/5 dark:bg-bg3 font-semibold">
        <td className="p-5">#</td>
        <td onClick={() => sortData("type")} className="p-5">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Type <IconSelector size={18} />
          </div>
        </td>
        <td onClick={() => sortData("size")} className="p-5 w-[16%]">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Size <IconSelector size={18} />
          </div>
        </td>
        <td className="p-5 w-[16%]">Version</td>
        <td onClick={() => sortData("name")} className="p-5">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Last Updated <IconSelector size={18} />
          </div>
        </td>
        <td className="p-5 text-center">Action</td>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

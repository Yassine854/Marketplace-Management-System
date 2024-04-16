"use client";

import { IconSelector } from "@tabler/icons-react";

const OrdersTableHead = ({ sortData }: any) => {
  return (
    <thead>
      <tr className="bg-primary/5 font-semibold dark:bg-bg3">
        <td className="p-5">#</td>
        <td onClick={() => sortData("type")} className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Type <IconSelector size={18} />
          </div>
        </td>
        <td onClick={() => sortData("size")} className="w-[16%] p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Size <IconSelector size={18} />
          </div>
        </td>
        <td className="w-[16%] p-5">Version</td>
        <td onClick={() => sortData("name")} className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Last Updated <IconSelector size={18} />
          </div>
        </td>
        <td className="p-5 text-center">Action</td>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

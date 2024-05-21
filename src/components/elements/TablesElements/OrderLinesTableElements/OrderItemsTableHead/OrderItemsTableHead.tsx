"use client";

import Checkbox from "../../../sharedElements/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import { useState } from "react";

const rows = [
  { name: "SKU", key: "id", isSortable: false },
  { name: "Designation", key: "customer", isSortable: false },
  { name: "Shipped", key: "subtotal", isSortable: false },
  { name: "PCB", key: "deliveryDate", isSortable: false },
  { name: "Quantity", key: "print", isSortable: false },
  { name: "Total", key: "source", isSortable: false },
];

const OrdersTableHead = ({
  onSortClick,
  selectAllOrders,
  unSelectAllOrders,
}: any) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSelected, setIsSelected] = useState(false);
  return (
    <thead className=" sticky top-10 z-10 rounded-xl bg-n40">
      <tr className=" font-semibold ">
        {rows.map((item, index) => (
          <td
            key={index}
            onClick={() => {
              if (item.isSortable) {
                const newSortOrder = sortOrder == "asc" ? "desc" : "asc";
                onSortClick({ name: item.name, key: item.key }, newSortOrder);
                setSortOrder(newSortOrder);
              }
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

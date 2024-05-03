"use client";

import Checkbox from "../../../sharedElements/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import { useState } from "react";

const rows = [
  { name: "ID", key: "id", isSortable: false },
  { name: "Customer", key: "customer", isSortable: false },
  { name: "Total", key: "subtotal", isSortable: true },
  { name: "Delivery Date", key: "deliveryDate", isSortable: false },
  { name: "Delivery Agent", key: "deliveryAgent", isSortable: false },
  { name: "Delivery Status", key: "deliveryStatus", isSortable: false },
  { name: "Print", key: "print", isSortable: false },
  { name: "Source", key: "source", isSortable: false },
  { name: "Actions", key: "actions", isSortable: false },
];

const OrdersTableHead = ({
  onSortClick,
  selectAllOrders,
  unSelectAllOrders,
}: any) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSelected, setIsSelected] = useState(false);
  return (
    <thead className=" sticky top-[70px] z-10 rounded-xl bg-n40">
      <tr className=" font-semibold ">
        <td className="group w-24 bg-primary/5 ">
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                isSelected ? unSelectAllOrders() : selectAllOrders();
                setIsSelected(!isSelected);
              }}
              className=" btn size  m-0 hidden h-8 p-2 text-center text-xs font-bold group-hover:block"
            >
              {isSelected ? "Unselect All" : "Select All"}
            </button>
            <div className="group-hover:hidden">
              <Checkbox
                onClick={(isChecked: boolean) => {
                  isChecked ? selectAllOrders() : unSelectAllOrders();
                  setIsSelected(isChecked);
                }}
                isChecked={isSelected}
              />
            </div>
          </div>
        </td>

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

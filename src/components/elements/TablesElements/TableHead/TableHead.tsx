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

const TableHead = ({
  onSortClick, // selectAllOrders,
} // unSelectAllOrders,
: any) => {
  const [sortOrder, setSortOrder] = useState("asc");

  return (
    <thead className=" sticky top-[70px] z-10 rounded-xl bg-n40">
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

export default TableHead;

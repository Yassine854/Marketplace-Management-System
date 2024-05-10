import { IconSelector } from "@tabler/icons-react";
import { useState } from "react";

const TableHead = ({
  cells, //onSortClick, // selectAllOrders,
} // unSelectAllOrders,
: any) => {
  //  const [sortOrder, setSortOrder] = useState("asc");

  return (
    <thead className=" sticky top-0 z-10 rounded-xl bg-n40">
      <tr className=" font-semibold ">
        {cells.map(({ cell }: any, index: number) => (
          <td
            key={index}
            onClick={() => {
              if (cell.isSortable) {
                // const newSortOrder = sortOrder == "asc" ? "desc" : "asc";
                // onSortClick({ name: item.name, key: item.key }, newSortOrder);
                // setSortOrder(newSortOrder);
              }
            }}
            className="w-14"
          >
            <div className="flex cursor-pointer select-none items-center justify-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
              {/* {cell.name} {cell.isSortable && <IconSelector size={18} />} */}
              {cell}
            </div>
          </td>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;

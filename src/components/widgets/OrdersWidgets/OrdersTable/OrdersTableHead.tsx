import Checkbox from "@/components/elements/sharedElements/Checkbox";
import { IconSelector } from "@tabler/icons-react";
import OrdersTableCell from "./OrdersTableCell";
import { useState } from "react";

const OrdersTableHead = ({ changeSelectedSort }: any) => {
  const [sort, setSort] = useState("");

  const onTotalClick = () => {
    setSort(sort === "total:asc" ? "total:desc" : "total:asc");
    changeSelectedSort(
      sort === "total:asc"
        ? { name: "Highest Total", key: "total:desc" }
        : { name: "Lowest Total", key: "total:asc" },
    );
  };

  const onDeliveryDateClick = () => {
    setSort(
      sort === "deliveryDate:asc" ? "deliveryDate:desc" : "deliveryDate:asc",
    );
    changeSelectedSort(
      sort === "deliveryDate:asc"
        ? { name: "Latest Delivery Date", key: "deliveryDate:desc" }
        : { name: "Earliest Delivery Date", key: "deliveryDate:asc" },
    );
  };

  const onCustomerClick = () => {
    setSort(
      sort === "customerFirstname:asc"
        ? "customerFirstname:desc"
        : "customerFirstname:asc",
    );
    changeSelectedSort(
      sort === "customerFirstname:asc"
        ? { name: "Customers (Z-A)", key: "customerFirstname:desc" }
        : { name: "Customers (A-Z)", key: "customerFirstname:asc" },
    );
  };

  return (
    <thead>
      <tr className="sticky top-0  z-10 h-12 min-h-12  w-full     bg-n40 font-semibold ">
        <OrdersTableCell>
          <Checkbox />
        </OrdersTableCell>
        <OrdersTableCell>ID</OrdersTableCell>

        <td
          className="h-20 min-w-24 max-w-16 border  "
          onClick={onCustomerClick}
        >
          <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
            Customer <IconSelector size={18} />
          </div>
        </td>
        <td className="h-20 min-w-24 max-w-16 border  " onClick={onTotalClick}>
          <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
            Total(TND)
            <IconSelector size={18} />
          </div>
        </td>
        <td
          className="h-20 min-w-24 max-w-16 border  "
          onClick={onDeliveryDateClick}
        >
          <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
            Delivery Date <IconSelector size={18} />
          </div>
        </td>
        <OrdersTableCell>Delivery Agent</OrdersTableCell>
        <OrdersTableCell>Delivery Status</OrdersTableCell>
        <OrdersTableCell>Summary</OrdersTableCell>
        <OrdersTableCell>Label</OrdersTableCell>
        <OrdersTableCell>Actions</OrdersTableCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

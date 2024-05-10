"use client";

import { IconPdf, IconTruck } from "@tabler/icons-react";

import Checkbox from "@/components/elements/sharedElements/Checkbox";
import OrdersLayout from "@/components/layouts/OrdersLayout";
import TableActions from "@/components/elements/TablesElements/OpenOrdersTableElements/TableActions";
import { useOrders } from "@/hooks/useOrders";

const tableHeadCells = [
  { cell: <div key={"id"}>ID</div> },
  { cell: <div key={"customer"}>Customer</div> },
  { cell: <div key="total">Total(TND)</div> },
  { cell: <div key="delivery">Delivery Date</div> },
  { cell: <div key="agent">Delivery Agent</div> },
  { cell: <div key="status">Delivery Status</div> },
  { cell: <div key="summary">Summary</div> },
  { cell: <div key="label">Label</div> },
  { cell: <div key="actions">Actions</div> },
];
const actions = [
  {
    name: "Edit",
    key: "edit",
    action: (id: any) => {
      //  push("/order/" + id);
    },
  },
  {
    name: "Generate Pick List",
    key: "picklist",
    action: () => {},
  },
  { name: "Print BL's", key: "bl", action: () => {} },
  {
    name: "Manage Milk-Runs",
    key: "mr",
    action: () => {
      //push("/milk-run");
    },
  },
];
const OrdersPage = () => {
  const { orders, totalOrders } = useOrders("open");
  const tableRows = orders?.map((order: any, i: number) => {
    return [
      {
        cell: (
          <Checkbox
            key="checkbox"
            // isChecked={order.isSelected}
            //  onClick={onCheckClick}
          />
        ),
      },
      { cell: <div key={i}>{order.id}</div> },
      { cell: <div key={i}>{order.id}</div> },
      { cell: <div key={i}>{order.id}</div> },
      { cell: <div key={i}>{order.id}</div> },
      { cell: <div key={i}>{order.id}</div> },
      {
        cell: (
          <div
            className="rounded-full p-2 hover:bg-n10"
            onClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <IconPdf />
          </div>
        ),
      },
      { cell: <IconTruck color="red" /> },
      { cell: <TableActions actions={actions} orderId={order.id} /> },
    ];
  });

  return (
    <OrdersLayout
      totalOrders={totalOrders}
      tableRows={tableRows}
      tableHeadCells={tableHeadCells}
    />
  );
};

export default OrdersPage;

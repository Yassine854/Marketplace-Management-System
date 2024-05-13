import Checkbox from "@/components/elements/sharedElements/Checkbox";
import OrdersTableCell from "./OrdersTableCell";

const OrdersTableHead = () => {
  return (
    <thead>
      <tr className="sticky top-0  z-10 h-12 min-h-12  w-full    border bg-n40   font-semibold">
        <OrdersTableCell>
          <Checkbox key="checkbox" />
        </OrdersTableCell>
        <OrdersTableCell>ID</OrdersTableCell>
        <OrdersTableCell>Customer</OrdersTableCell>
        <OrdersTableCell>Total(TND)</OrdersTableCell>
        <OrdersTableCell>Delivery Date</OrdersTableCell>
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

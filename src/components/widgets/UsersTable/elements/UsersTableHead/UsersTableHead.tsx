import { IconSelector } from "@tabler/icons-react";
import OrdersTableHeadCell from "./UsersTableHeadCell";
import { useOrdersTableHead } from "./useUsersTableHead";

const Sort = ({ children, onClick }: any) => (
  <div
    onClick={onClick}
    className="flex cursor-pointer items-center justify-center"
  >
    {children}
    <IconSelector size={18} />
  </div>
);

const OrdersTableHead = ({ changeSelectedSort }: any) => {
  const { onCustomerClick, onTotalClick } =
    useOrdersTableHead(changeSelectedSort);

  return (
    <thead className="sticky top-0 z-10">
      <tr className="  h-12  w-full bg-n40 font-semibold">
        <OrdersTableHeadCell>Username</OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          <Sort>Name</Sort>
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onCustomerClick}>
          <Sort>Email</Sort>
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          <Sort>Role</Sort>
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          <Sort>Status</Sort>
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>
          <Sort>Created at</Sort>
        </OrdersTableHeadCell>
        <OrdersTableHeadCell onClick={onTotalClick}>Edit</OrdersTableHeadCell>
      </tr>
    </thead>
  );
};

export default OrdersTableHead;

const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td
    className="h-16 min-w-40 max-w-16 border-x-4 border-n30  p-2 "
    onClick={onClick}
  >
    <div className="  flex cursor-pointer  items-center justify-center   truncate text-ellipsis ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;

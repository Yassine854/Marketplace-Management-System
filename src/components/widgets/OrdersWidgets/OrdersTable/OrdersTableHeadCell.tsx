const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td className="border-3 h-20 min-w-40 max-w-16 p-4 " onClick={onClick}>
    <div className="  flex cursor-pointer  items-center justify-center   truncate text-ellipsis ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;

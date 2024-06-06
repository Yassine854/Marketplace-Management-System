const OrdersTableCell = ({ children }: any) => (
  <td className="h-20 min-w-24 max-w-16 border-4  ">
    <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
      {children}
    </div>
  </td>
);

export default OrdersTableCell;

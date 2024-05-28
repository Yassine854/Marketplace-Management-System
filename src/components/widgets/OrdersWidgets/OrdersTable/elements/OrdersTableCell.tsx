const OrdersTableCell = ({ children }: any) => (
  <td className="h-20  max-w-16 border-2  ">
    <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4 text-sm">
      {children}
    </div>
  </td>
);

export default OrdersTableCell;

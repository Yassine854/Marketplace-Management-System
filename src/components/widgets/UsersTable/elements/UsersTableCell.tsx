const OrdersTableCell = ({ children }: any) => (
  <td className="h-20   border-2  ">
    <div className="flex  select-none items-center justify-center   truncate text-ellipsis p-4 text-sm">
      {children}
    </div>
  </td>
);

export default OrdersTableCell;

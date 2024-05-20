const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td className="h-20 w-6 border  " onClick={onClick}>
    <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;

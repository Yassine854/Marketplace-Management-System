const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td className="h-16 w-6 border-x-4 border-n30 " onClick={onClick}>
    <div className="flex cursor-pointer select-none items-center justify-center   truncate text-ellipsis p-4">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;

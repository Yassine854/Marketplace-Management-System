const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td className={`h-16 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
    <div className="flex h-full w-full items-center justify-center bg-yellow-400 text-sm font-bold">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;

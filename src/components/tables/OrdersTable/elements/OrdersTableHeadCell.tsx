const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td
    className={`h-14 px-8 ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <div className="flex h-full w-full items-center justify-center font-bold">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;

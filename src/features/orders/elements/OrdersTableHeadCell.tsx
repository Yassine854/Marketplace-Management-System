const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td
    className={`h-14 px-8 ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <div className="border-b border-gray-100 bg-gray-50">{children}</div>
  </td>
);

export default OrdersTableHeadCell;

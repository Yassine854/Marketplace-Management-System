const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td className="border-b border-gray-100 bg-gray-50" onClick={onClick}>
    <div className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;

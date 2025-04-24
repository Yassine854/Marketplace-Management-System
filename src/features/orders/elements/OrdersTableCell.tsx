const OrdersTableCell = ({ children }: any) => (
  <td className="group relative ">
    <div className="items flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap whitespace-nowrap px-3 py-2 text-center text-sm">
      {children && children.length > 25
        ? `${children.slice(0, 18)}...`
        : children}
    </div>
  </td>
);

export default OrdersTableCell;

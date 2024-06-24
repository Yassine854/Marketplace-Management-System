const OrdersTableCell = ({ children }: any) => (
  <td className=" ">
    <div className="items flex  justify-center  truncate text-ellipsis px-3 py-2 text-center text-sm">
      {children}
    </div>
  </td>
);

export default OrdersTableCell;

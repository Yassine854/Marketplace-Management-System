const OrdersTableCell = ({ children }: any) => (
  <td className="w-14">
    <div className="flex cursor-pointer select-none items-center justify-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
      <div key={"id"}>{children}</div>
    </div>
  </td>
);

export default OrdersTableCell;

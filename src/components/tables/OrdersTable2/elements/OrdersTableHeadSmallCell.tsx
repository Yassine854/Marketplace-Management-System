const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td className=" h-16 w-12 " onClick={onClick}>
    <div className="flex h-full w-full items-center justify-center bg-red-400 text-sm font-bold ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;
